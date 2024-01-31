import { fetcher } from '@/lib/client/utils';
import { Order } from '@/lib/types';
import useSWR from 'swr';

export default function useFetchOrdersByIds(orderIds?: string[]) {
  const fetchOrdersUrl =
    orderIds && orderIds.length ? `/api/orders?${orderIds.map((id: string) => `id=${id}`).join('&')}` : '';

  const { data: orders } = useSWR<any[]>(fetchOrdersUrl, fetcher, {
    fallbackData: [],
  });
  return orders;
}
