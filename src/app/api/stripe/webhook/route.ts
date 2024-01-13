import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import Order from '@/lib/mongodb/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/lib/mongodb/models/User';
import mongoose, { ClientSession } from 'mongoose';
import { LineItem } from '@stripe/stripe-js';
import Event from '@/lib/mongodb/models/Event';

const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not defined');
if (!STRIPE_WEBHOOK_SECRET)
  throw new Error('STRIPE_WEBHOOK_SECRET not defined');

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  try {
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
        !metadata?.orderId ||
        paymentStatus !== 'paid' ||
        !customerDetails?.email
      ) {
        throw Error('Order details not complete');
      }

      const order = await Order.findByIdAndUpdate(
        metadata.orderId,
        {
          isPaid: true,
          email: customerDetails.email,
        },
        { session }
      );
      // If user does not exist, create new user entry
      const user = await User.findOneAndUpdate(
        { userId: order.userId },
        { worldId: order.worldId, $push: { orders: metadata.orderId } },
        { upsert: true, session }
      );

      // TODO: Fulfill order

      // Increment ticketsPurchased field in each event
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ['line_items', 'line_items.data.price.product'],
        }
      );
      const lineItems = sessionWithLineItems.line_items?.data;
      if (!lineItems) {
        throw Error('No line items in order to fulfill');
      }

      const updatingEventPromises: Promise<any>[] = [];

      lineItems.forEach((lineItem) => {
        const lineItemProductdata = lineItem.price?.product as any;
        if (lineItemProductdata.metadata.eventId) {
          updatingEventPromises.push(
            Event.updateOne(
              {
                eventId: lineItemProductdata.metadata.eventId,
              },
              {
                $inc: {
                  ticketsPurchased: lineItem.quantity,
                },
              },
              {
                session,
              }
            )
          );
        }
      });
      await Promise.all(updatingEventPromises);
    }

    if (event.type === 'checkout.session.expired') {
      const metadata = event.data.object.metadata;
      if (metadata?.orderId) {
        await Order.findByIdAndDelete(metadata.orderId, { session });
      }
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return NextResponse.json(
      { error: `Internal Server Error (/api/stripe/webhook): ${error}` },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
