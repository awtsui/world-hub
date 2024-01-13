import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';

import Order from '@/lib/mongodb/models/Order';

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const orderIds = searchParams.getAll('id');
    if (!userId && !orderIds.length) {
      throw Error('Parameters not defined properly');
    }

    let data = [];
    if (userId) {
      data = await Order.find({ userId: userId });
    } else if (orderIds.length) {
      data = await Order.find({
        _id: { $in: orderIds },
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
      { error: `Internal Server Error (/api/orders): ${error}` },
      { status: 500 }
    );
  }
}
