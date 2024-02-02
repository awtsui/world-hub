import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/lib/mongodb/utils/events';
import { EventDataRequestBodySchema } from '@/lib/zod/apischema';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import mongoose, { ClientSession } from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  // TODO: validate request body
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const reqBody = await request.json();
    const token = await getToken({ req: request });

    if (!token) {
      throw Error('Not authorized');
    }

    const validatedReqBody = EventDataRequestBodySchema.safeParse(reqBody);
    if (!validatedReqBody.success) {
      console.error(validatedReqBody.error.errors);
      throw Error('Invalid request body');
    }

    const resp = await createEvent(validatedReqBody.data, token.id, session);

    if (!resp.success) {
      throw Error(resp.error);
    }

    revalidatePath('/');

    await session.commitTransaction();

    return NextResponse.json(
      { message: 'Event successfully created!', eventId: resp.eventId },
      {
        status: 200,
      },
    );
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json({ error: `Internal Server Error (/api/events/create): ${error}` }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
