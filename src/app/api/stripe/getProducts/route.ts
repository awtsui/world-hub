import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const { STRIPE_SECRET_KEY } = process.env;

if (!STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not defined');

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function GET(request: NextRequest) {
  const limit = parseInt(request.nextUrl.searchParams.get('limit') as string);
  try {
    const prices = await stripe.prices.list({
      active: true,
      limit: limit || 10,
    });

    return NextResponse.json(prices.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
