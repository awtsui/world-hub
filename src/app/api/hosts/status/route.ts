import Host from '@/lib/mongodb/models/Host';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const hostId = searchParams.get('id');

    let data;
    if (hostId) {
      data = await Host.findOne({ hostId });
    }

    if (!data) {
      throw Error('Failed to retrieve host account status');
    }

    // TODO: look into mongoose/mongo config where password is never pulled from db

    const formattedData = {
      hostId: data.hostId,
      name: data.name,
      email: data.email,
      approvalStatus: data.approvalStatus,
    };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/hosts): ${error}` }, { status: 500 });
  }
}
