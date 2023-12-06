import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';
import Event from '@/models/Event';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const eventId = parseInt(params.id);
    const resp = await Event.find({ eventId: eventId });
    return NextResponse.json(resp[0], {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
