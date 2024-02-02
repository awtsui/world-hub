import Venue from '@/lib/mongodb/models/Venue';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { uploadVenue } from '@/lib/mongodb/utils/venues';
import { VenueDataRequestBodySchema } from '@/lib/zod/apischema';
import mongoose, { ClientSession } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const venueId = searchParams.get('id');
    const keyword = searchParams.get('keyword');

    let data;
    if (venueId) {
      data = await Venue.findOne({ venueId });
    } else if (keyword) {
      data = await Venue.find({ name: { $regex: keyword, $options: 'i' } });
    } else {
      data = await Venue.find({});
    }

    if (!data) {
      throw Error('Failed to retrieve venues');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/venues): ${error}` }, { status: 500 });
  }
}

// TODO: implement when venue portal is added

export async function POST(request: NextRequest) {
  await dbConnect();
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqBody = await request.json();

    const validatedReqBody = VenueDataRequestBodySchema.safeParse(reqBody);
    if (!validatedReqBody.success) {
      throw Error('Invalid request body');
    }

    const resp = await uploadVenue(validatedReqBody.data, session);

    if (!resp.success) {
      throw Error(resp.error);
    }

    await session.commitTransaction();

    return NextResponse.json({ message: 'Successfully uploaded venue', venue: resp.venueId }, { status: 200 });
  } catch (error) {
    await session.abortTransaction();

    return NextResponse.json({ error: `Internal Server Error (/api/venues): ${error}` }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
