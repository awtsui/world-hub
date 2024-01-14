import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { updateUserAccount } from '@/lib/mongodb/utils/users';
import { UserAccountDataRequestBodySchema } from '@/lib/zod/apischema';
import mongoose, { ClientSession } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// Note: Endpoint is meant to update user account data (email)

export async function POST(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const reqBody = await request.json();

    const validatedReqBody =
      UserAccountDataRequestBodySchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      throw Error('Invalid user profile data');
    }

    const resp = await updateUserAccount(validatedReqBody.data, session);

    if (!resp.success) {
      throw Error(resp.error);
    }

    await session.commitTransaction();

    return NextResponse.json(
      { message: 'Successfully updated user profile', user: resp.userId },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();

    return NextResponse.json(
      { error: `Internal Server Error (/api/users): ${error}` },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}
