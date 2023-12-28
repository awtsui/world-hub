import Venue from '@/models/Venue';
import dbConnect from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const venueId = searchParams.get('id');
    if (!venueId) {
      throw Error('Parameters not properly defined');
    }
    const venue = await Venue.find({ venueId });
    if (!venue) {
      throw Error(`User with id(${venueId}) may not exist`);
    }
    return NextResponse.json(venue, { status: 200 });
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
