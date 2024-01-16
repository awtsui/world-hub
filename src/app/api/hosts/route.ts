import Host from '@/lib/mongodb/models/Host';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';

// TODO: add admin authorization to GET

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;

    let data = await Host.find({});

    if (!data) {
      throw Error('Failed to retrieve hosts');
    }

    // TODO: look into mongoose/mongo config where password is never pulled from db

    data = data.map((host) => ({
      hostId: host.hostId,
      name: host.name,
      email: host.email,
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/hosts): ${error}` },
      { status: 500 }
    );
  }
}
