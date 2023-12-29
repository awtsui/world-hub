import User from '@/models/User';
import dbConnect from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const worldId = searchParams.get('worldId');
    const userId = searchParams.get('id');
    if (!worldId && !userId) {
      throw Error('Parameters not properly defined');
    }

    let data;
    if (worldId) {
      data = await User.find({ worldId: worldId });
    } else if (userId) {
      data = await User.findById(userId);
    }

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/user): ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    // TODO: validate request body
    const reqBody = await request.json();
    return NextResponse.json(await User.create(reqBody));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
