import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongoosedb';

import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const eventIds = searchParams.getAll('id');
    const category = searchParams.get('category');

    if (eventIds.length && category) {
      throw Error('Parameters not properly defined');
    }

    let data;
    if (eventIds.length) {
      data = await Event.find({ eventId: { $in: eventIds } });
    } else if (category) {
      data = await Event.find({ category: category });
    } else {
      data = await Event.find({});
    }
    if (!data.length) {
      throw Error(`Events may not exist`);
    }
    data = data.map((event) => {
      return {
        ...event._doc,
        ticketTiers: event.ticketTiers.map((tier: any) => {
          return {
            label: tier.label,
            price: tier.price.toString(),
          };
        }),
      };
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/events): ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // TODO: validate request body
  try {
    await dbConnect();
    const reqBody = await request.json();
    return NextResponse.json(await Event.create(reqBody));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
