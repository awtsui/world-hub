import UserProfile from '@/lib/mongodb/models/UserProfile';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('id');

    if (!userId) {
      throw Error('Parameters not properly defined');
    }

    const data = await UserProfile.findOne({ userId });

    if (!data) {
      throw Error('Failed to retrieve user profile');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/hosts/profiles): ${error}` },
      { status: 500 }
    );
  }
}
