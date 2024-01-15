import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { generateTicket } from '@/lib/mongodb/utils/tickets';
import { TicketGeneratorDataRequestBodySchema } from '@/lib/zod/apischema';
import mongoose, { ClientSession } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Note: This endpoint should not be called directly. Will require admin level authority

export async function POST(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await request.json();
    // TODO: validate reqBody
    const validatedReqBody =
      TicketGeneratorDataRequestBodySchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      console.error(validatedReqBody.error.errors);
      throw Error('Invalid request body');
    }

    const resp = await generateTicket(validatedReqBody.data, session);

    if (!resp.success) {
      throw Error(resp.error);
    }

    await session.commitTransaction();
    return NextResponse.json(
      {
        message: 'Ticket generation was successful',
        hash: resp.hash,
      },
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
