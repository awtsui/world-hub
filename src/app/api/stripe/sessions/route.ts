import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import mongoose, { ClientSession } from 'mongoose';
import { StripeSessionDataRequestBodySchema } from '@/lib/zod/apischema';
import { createStripeSession } from '@/lib/stripe/utils/sessions';
import { getToken } from 'next-auth/jwt';

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
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await request.json();
    const token = await getToken({ req: request });

    if (!token) {
      throw Error('Not authorized');
    }

    const validatedReqBody = StripeSessionDataRequestBodySchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      console.error(validatedReqBody.error.errors);
      throw Error('Invalid request body');
    }

    const resp = await createStripeSession(validatedReqBody.data, token.id, session);

    await session.commitTransaction();

    return NextResponse.json(
      {
        message: 'Successfully create stripe session',
        clientSecret: resp.clientSecret,
      },
      { status: 200 },
    );
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
