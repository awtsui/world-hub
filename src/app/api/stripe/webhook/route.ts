import dbConnect from '@/utils/mongoosedb';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/models/User';

const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not defined');
if (!STRIPE_WEBHOOK_SECRET)
  throw new Error('STRIPE_WEBHOOK_SECRET not defined');

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature') ?? '';

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const metadata = event.data.object.metadata;
      const paymentStatus = event.data.object.payment_status;
      const customerDetails = event.data.object.customer_details;
      if (
        metadata?.orderId &&
        paymentStatus === 'paid' &&
        customerDetails?.email
      ) {
        const order = await Order.findByIdAndUpdate(metadata.orderId, {
          isPaid: true,
          email: customerDetails.email,
        });
        // TODO: If user does not exist, create new user entry
        const user = await User.findOneAndUpdate(
          { userId: order.userId },
          { $push: { orders: metadata.orderId } }
        );
      }
      // TODO: Fulfill order
    }

    if (event.type === 'checkout.session.expired') {
      const metadata = event.data.object.metadata;
      if (metadata?.orderId) {
        await Order.findByIdAndDelete(metadata.orderId);
      }
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/stripe/webhook): ${error}` },
      { status: 500 }
    );
  }
}
