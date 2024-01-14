import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import Order from '@/lib/mongodb/models/Order';
import Big from 'big.js';
import mongoose, { ClientSession } from 'mongoose';
import { StripeSessionDataRequestBodySchema } from '@/lib/zod/apischema';
import Ticket from '@/lib/mongodb/models/Ticket';

const { STRIPE_SECRET_KEY } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not defined');

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('id');
    if (!sessionId) {
      throw Error('Parameters not properly defined');
    }
    if (!sessionId.startsWith('cs_')) {
      throw Error('Incorrect Checkout Session ID');
    }
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    });

    const metadata = checkoutSession.metadata;

    return NextResponse.json(
      {
        status: checkoutSession.status,
        payment_status: checkoutSession.payment_status,
        customer_email: checkoutSession.customer_details?.email,
        order_id: checkoutSession.metadata?.orderId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await request.json();

    const validatedReqBody =
      StripeSessionDataRequestBodySchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      throw Error('Invalid request body data');
    }

    const { tickets, userId, email } = validatedReqBody.data;

    const newTicketPromises: Promise<any>[] = [];

    const lineItems: any[] = [];
    let totalPrice = Big('0.0');
    let amount = 0;
    tickets.forEach((item: any) => {
      // TODO: convert price field to Big
      const ticketAmount = Big(item.price).times(item.unitAmount);
      totalPrice = totalPrice.add(ticketAmount);
      amount += item.unitAmount;
      lineItems.push({
        quantity: item.unitAmount,
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.eventTitle,
            metadata: { eventId: item.eventId, label: item.label },
          },
          unit_amount: Big(item.price).times(100).toNumber(),
        },
      });
      newTicketPromises.push(
        Ticket.create(
          Array(item.unitAmount)
            .fill('_')
            .map((_) => ({
              eventId: item.eventId,
              label: item.label,
              hash: '',
              hasValidated: false,
              isExpired: false,
            })),
          { session }
        )
      );
    });

    const newTicketResults = await Promise.allSettled(newTicketPromises);
    const newTickets: any[] = [];
    newTicketResults.forEach((result) => {
      if (result.status === 'rejected') {
        throw Error('Failed to create all tickets');
      } else {
        newTickets.push(result.value);
      }
    });

    const newTicketIds = newTickets
      .flat()
      .map((ticket: any) => ticket._id.toString());

    const order = await Order.create(
      [
        {
          userId,
          isPaid: false,
          amount,
          totalPrice: totalPrice.toNumber(),
          ticketData: tickets,
          email: '',
          tickets: newTicketIds,
        },
      ],
      {
        session,
      }
    );

    const headerList = headers();
    const originUrl = headerList.get('origin');

    const stripeSession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: `${originUrl}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      metadata: { orderId: order[0]._id.toString() },
      customer_email: email,
    });

    await session.commitTransaction();

    return NextResponse.json(
      { clientSecret: stripeSession.client_secret },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}
