import User from '@/lib/mongodb/models/User';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { updateUserAccount } from '@/lib/mongodb/utils/users';
import { UserAccountDataRequestBodySchema } from '@/lib/zod/apischema';
import mongoose, { ClientSession } from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// TODO: add authorization to GET

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('id');

    let data;
    if (userId) {
      data = await User.findOne({ userId });
    } else {
      data = await User.find({});
    }

    if (!data) {
      throw Error('Failed to retrieve users');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/users): ${error}` },
      { status: 500 }
    );
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

    const validatedReqBody =
      UserAccountDataRequestBodySchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      console.error(validatedReqBody.error.errors);
      throw Error('Invalid user profile data');
    }

    const resp = await updateUserAccount(
      validatedReqBody.data,
      token.id,
      session
    );

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
