import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';

import Event from '@/lib/mongodb/models/Event';
import { deleteEvent } from '@/lib/mongodb/utils/events';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const eventIds = searchParams.getAll('id');
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subcategory');

    if ((eventIds.length && category) || (eventIds.length && subCategory)) {
      throw Error('Parameters not properly defined');
    }

    let data;
    if (eventIds.length) {
      data = await Event.find({ eventId: { $in: eventIds } });
    } else if (category) {
      data = await Event.find({ category: category });
    } else if (subCategory) {
      data = await Event.find({ subCategory: subCategory });
    } else {
      data = await Event.find({});
    }

    if (!data) {
      throw Error('Failed to retrieve events');
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

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('id');

    if (!eventId) {
      throw Error('Parameters not properly defined');
    }

    const resp = await deleteEvent(eventId);
    if (!resp.success) {
      throw Error(resp.error);
    }

    return NextResponse.json(
      { message: `Successfully deleted event ${eventId}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/events): ${error}` },
      { status: 500 }
    );
  }
}
