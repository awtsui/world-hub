import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import Order from '@/lib/mongodb/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/lib/mongodb/models/User';
import mongoose, { ClientSession } from 'mongoose';
import Event from '@/lib/mongodb/models/Event';
import UserProfile from '@/lib/mongodb/models/UserProfile';
import { generateTicket } from '@/lib/mongodb/utils/tickets';
import { TicketWithData } from '@/lib/types';
import { revalidateTag } from 'next/cache';

const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not defined');
if (!STRIPE_WEBHOOK_SECRET)
  throw new Error('STRIPE_WEBHOOK_SECRET not defined');

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  try {
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

      if (!order) {
        throw Error('Order does not exist');
      }

      // Fail if user does not already exist in mongodb
      const user = await User.findOne(
        {
          userId: order.userId,
        },
        null,
        { session }
      );

      if (!user) {
        throw Error('User does not exist');
      }

      const userProfile = await UserProfile.updateOne(
        { userId: order.userId },
        { $push: { orders: metadata.orderId } },
        { session }
      );

      // Track ticket purchases in individual events
      const ticketData = order.ticketData;
      const updateEventPromises: Promise<any>[] = [];
      ticketData.forEach((data: TicketWithData) => {
        updateEventPromises.push(
          Event.updateOne(
            {
              eventId: data.eventId,
            },
            {
              $inc: {
                ticketsPurchased: data.unitAmount,
              },
            },
            {
              session,
            }
          )
        );
      });

      const updateEventResults = await Promise.allSettled(updateEventPromises);
      updateEventResults.forEach((result) => {
        if (result.status === 'rejected') {
          throw Error('Failed to update all events');
        }
      });

      const ticketIds = order.tickets;
      const generateTicketPromises: Promise<any>[] = [];
      ticketIds.forEach((ticketId: string) => {
        generateTicketPromises.push(generateTicket({ ticketId }, session));
      });

      const generateTicketResults = await Promise.allSettled(
        generateTicketPromises
      );
      generateTicketResults.forEach((result) => {
        if (result.status === 'rejected') {
          throw Error('Failed to generate all tickets');
        }
      });

      revalidateTag('order');
      revalidateTag('user');
      revalidateTag('userprofile');
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
    return NextResponse.json(
      { error: `Internal Server Error (/api/stripe/webhook): ${error}` },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}
