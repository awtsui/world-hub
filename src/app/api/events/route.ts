import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';

import Event from '@/lib/mongodb/models/Event';
import { deleteEvent } from '@/lib/mongodb/utils/events';
import mongoose, { ClientSession } from 'mongoose';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const eventIds = searchParams.getAll('id');
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subcategory');
    const approvalStatus = searchParams.get('status');

    if ((eventIds.length && category) || (eventIds.length && subCategory)) {
      throw Error('Parameters not properly defined');
    }

    let data;
    if (eventIds.length) {
      data = await Event.find({ eventId: { $in: eventIds } });
    } else if (category) {
      data = await Event.find({ category });
    } else if (subCategory) {
      data = await Event.find({ subCategory });
    } else if (approvalStatus) {
      data = await Event.find({ approvalStatus });
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
    return NextResponse.json({ error: `Internal Server Error (/api/events): ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('id');
    const token = await getToken({ req: request });

    if (!token) {
      throw Error('Not authorized');
    }

    if (!eventId) {
      throw Error('Parameters not properly defined');
    }

    const resp = await deleteEvent(eventId, token.id, session);
    if (!resp.success) {
      throw Error(resp.error);
    }

    await session.commitTransaction();

    return NextResponse.json({ message: `Successfully deleted event ${eventId}` }, { status: 200 });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return NextResponse.json({ error: `Internal Server Error (/api/events): ${error}` }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
