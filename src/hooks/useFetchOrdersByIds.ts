import { fetcher } from '@/lib/client/utils';
import { Order } from '@/lib/types';
import useSWR from 'swr';

export default function useFetchOrdersByIds(orderIds?: string[]) {
  const fetchOrdersUrl =
    orderIds && orderIds.length ? `/api/orders?${orderIds.map((id: string) => `id=${id}`).join('&')}` : '';

  const { data: orders } = useSWR(fetchOrdersUrl, fetcher, {
    fallbackData: [],
  });
  const formattedOrders = orders.map((order: any) => {
    const { __v, ...rest } = order;
    return {
      ...rest,
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

  return formattedOrders as (Order & { _id: string })[];
}
