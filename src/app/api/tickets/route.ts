import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import Ticket from '@/lib/mongodb/models/Ticket';

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const ticketIds = searchParams.getAll('id');
    if (!ticketIds.length) {
      throw Error('Parameters not defined properly');
    }

    let data = [];
    if (ticketIds.length) {
      data = await Ticket.find({
        _id: { $in: ticketIds },
      });
    }

    if (!data) {
      throw Error('Failed to retrieve orders');
    }

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/tickets): ${error}` },
      { status: 500 }
    );
  }
}
