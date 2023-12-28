import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';

import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
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
    if (!data.length) {
      throw Error('Orders may not exist');
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

// export async function POST(request: NextRequest) {
//   // TODO: validate request body
//   try {
//     await dbConnect();
//     const reqBody = await request.json();
//     return NextResponse.json(await Order.create(reqBody));
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
