import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { validateTicket } from '@/lib/mongodb/utils/tickets';
import { TicketValidatorDataRequestBodySchema } from '@/lib/zod/apischema';
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { ClientSession } from 'mongoose';

// Note: eventId should be provided by scanner automatically
// Note: user's qrcode should provide ticket hash and tier label

export async function POST(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const reqBody = await request.json();

    const validatedReqBody =
      TicketValidatorDataRequestBodySchema.safeParse(reqBody);
    if (!validatedReqBody.success) {
      console.log(validatedReqBody.error.errors);
      throw Error('Invalid request body');
    }

    const resp = await validateTicket(validatedReqBody.data, session);
    if (!resp.success) {
      throw Error('Ticket failed validation');
    }

    await session.commitTransaction();

    return NextResponse.json(
      { message: 'Successfully validated ticket' },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}
