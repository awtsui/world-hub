import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import User from '@/lib/mongodb/models/User';

const { EMAIL_SECRET } = process.env;

if (!EMAIL_SECRET) throw new Error('EMAIL_SECRET not defined');

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      throw Error('Token is required for confirmation');
    }

    // const {
    //   user: { id },
    // } = jwt.verify(token, EMAIL_SECRET!);

    await User.updateOne({}, { isVerified: true });

    return NextResponse.json({ message: 'Email is verified' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/events): ${error}` },
      { status: 500 }
    );
  }
}
