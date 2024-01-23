import UserProfile from '@/lib/mongodb/models/UserProfile';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';

// TODO: re add authorization

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('id');

    let data;
    if (userId) {
      data = await UserProfile.findOne({ userId });
    } else {
      data = await UserProfile.find({});
    }

    if (!data) {
      throw Error('Failed to retrieve user profile');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/users/profiles): ${error}` }, { status: 500 });
  }
}
