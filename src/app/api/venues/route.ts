import Venue from '@/lib/mongodb/models/Venue';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const venueId = searchParams.get('id');
    let data;
    if (venueId) {
      data = await Venue.findOne({ venueId });
    } else {
      data = await Venue.find({});
    }

    if (!data) {
      throw Error('Failed to retrieve venues');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/venues): ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    // TODO: validate request body
    const reqBody = await request.json();
    return NextResponse.json(await Venue.create(reqBody));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}