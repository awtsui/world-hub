import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { CartItem } from '@/types';
import dbConnect from '@/utils/mongodb';
import Order from '@/models/Order';

const { STRIPE_SECRET_KEY } = process.env;

if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not defined');

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { cartItems, userId } = await request.json();

    if (!cartItems.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json(
        { error: 'User is not authenticated' },
        { status: 400 }
      );
    }

    let lineItems: any[] = [];
    cartItems.forEach((item: CartItem) => {
      lineItems.push({
        quantity: item.unitAmount,
        price_data: {
          currency: 'USD',
          product_data: {
            name: item.eventName,
            metadata: { eventId: item.eventId },
          },
          unit_amount: Math.round(parseFloat(item.price) * 100),
        },
      });
    });

    const order = await Order.create({
      items: lineItems,
      userId,
      isPaid: false,
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
