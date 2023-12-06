import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';

import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const category = request.nextUrl.searchParams.get('category') as string;
    if (category) {
      return NextResponse.json(await Event.find({ category: category }), {
        status: 200,
      });
    }
    return NextResponse.json(await Event.find({}), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    return NextResponse.json(await Event.create(request.body));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
