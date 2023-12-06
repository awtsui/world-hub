import dbConnect from '@/utils/mongodb';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
      if (metadata?.orderId && paymentStatus === 'paid') {
        try {
          await Order.findByIdAndUpdate(metadata.orderId, { isPaid: true });
        } catch (err) {
          throw err;
        }
      }
      // TODO: Fulfill order
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
