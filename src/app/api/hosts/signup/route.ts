import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/mongodb/utils/hosts';
import { HostSignUpFormSchema } from '@/lib/zod/schema';
import mongoose, { ClientSession } from 'mongoose';

export async function POST(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const reqBody = await request.json();
    const validatedReqBody = HostSignUpFormSchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      const { errors } = validatedReqBody.error;
      return NextResponse.json(
        {
          error: { message: 'Invalid request', errors },
        },
        { status: 400 }
      );
    }

    const resp = await signUp(validatedReqBody.data, session);

    if (!resp.success) {
      throw Error(resp.error);
    }

    await session.commitTransaction();

    return NextResponse.json(
      {
        message: 'Host account and profile successfully created!',
        hostId: resp.hostId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json(
      { error: `Internal Server Error (/api/hosts/signup): ${error}` },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}
