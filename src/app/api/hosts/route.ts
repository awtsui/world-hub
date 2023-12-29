import Host from '@/models/Host';
import dbConnect from '@/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const hostId = searchParams.get('id');
    if (!hostId) {
      throw Error('Parameters not properly defined');
    }
    const host = await Host.find({ hostId });
    if (!host) {
      throw Error(`Host with id(${hostId}) may not exist`);
    }
    return NextResponse.json(host, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/hosts): ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    // TODO: validate request body
    const reqBody = await request.json();
    return NextResponse.json(await Host.create(reqBody));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
