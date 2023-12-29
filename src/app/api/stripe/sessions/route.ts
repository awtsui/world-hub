import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { Ticket } from '@/types';
import dbConnect from '@/utils/mongoosedb';
import Order from '@/models/Order';
import Big from 'big.js';

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

    return NextResponse.json(
      {
        status: checkoutSession.status,
        payment_status: checkoutSession.payment_status,
        customer_email: checkoutSession.customer_details?.email,
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
  try {
    await dbConnect();
    const { tickets, userId } = await request.json();

    if (!tickets.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json(
        { error: 'User is not authenticated' },
        { status: 400 }
      );
    }

    let lineItems: any[] = [];
    let totalPrice = Big(0);
    let amount = 0;
    tickets.forEach((item: Ticket) => {
      const ticketAmount = item.price.times(item.unitAmount);
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
          unit_amount: ticketAmount,
        },
      });
    });

    const order = await Order.create({
      userId,
      isPaid: false,
      amount,
      totalPrice,
      tickets,
      email: '',
    });

    const headerList = headers();
    const originUrl = headerList.get('origin');

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: `${originUrl}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      metadata: { orderId: order._id.toString() },
    });
    return NextResponse.json(
      { clientSecret: session.client_secret },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
