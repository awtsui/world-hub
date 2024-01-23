import HostProfile from '@/lib/mongodb/models/HostProfile';
import { updateHostProfile } from '@/lib/mongodb/utils/hostprofiles';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { HostProfileDataRequestBodySchema } from '@/lib/zod/apischema';
import mongoose, { ClientSession } from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const hostId = searchParams.get('id');
    let data;
    if (hostId) {
      data = await HostProfile.findOne({ hostId });
    } else {
      data = await HostProfile.find({});
    }

    if (!data) {
      throw Error('Failed to retrieve host profile');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/hosts/profiles): ${error}` }, { status: 500 });
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

    const validatedReqBody = HostProfileDataRequestBodySchema.safeParse(reqBody);

    if (!validatedReqBody.success) {
      console.error(validatedReqBody.error.errors);
      throw Error('Invalid request body');
    }

    const resp = await updateHostProfile(validatedReqBody.data, token.id, session);

    if (!resp.success) {
      throw Error(resp.error);
    }
    await session.commitTransaction();

    return NextResponse.json({ message: 'Successfully updated host profile', hostId: resp.hostId }, { status: 200 });
  } catch (error) {
    await session.abortTransaction();

    return NextResponse.json({ error: `Internal Server Error (/api/hosts/profile): ${error}` }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
