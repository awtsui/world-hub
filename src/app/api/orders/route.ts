import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';

import Order from '@/lib/mongodb/models/Order';
import { getToken } from 'next-auth/jwt';

// TODO: add authorization to GET

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const orderIds = searchParams.getAll('id');

    const token = await getToken({ req: request });

    let data = [];
    if (userId) {
      data = await Order.find({ userId: userId });
    } else if (orderIds.length) {
      data = await Order.find({
        _id: { $in: orderIds },
      });
    } else {
      if (token?.role !== 'admin') {
        throw Error('Not authorized');
      }
      data = await Order.find({});
    }

    if (!data) {
      throw Error('Failed to retrieve orders');
    }

    data = data.map((order) => {
      return {
        ...order._doc,
        _id: order._id.toString(),
        totalPrice: order.totalPrice.toString(),
        ticketData: order.ticketData.map((data: any) => {
          return {
            ...data._doc,
            price: data.price.toString(),
          };
        }),
      };
    });

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/orders): ${error}` }, { status: 500 });
  }
}
