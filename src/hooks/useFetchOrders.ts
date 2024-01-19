'use client';

import { handleFetchError } from '@/lib/client/utils';
import { Order } from '@/lib/types';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface useFetchOrdersParams {
  orderIds?: string[];
}

export default function useFetchOrders({ orderIds }: useFetchOrdersParams) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (orderIds && orderIds.length) {
      const fetchOrdersUrl = `/api/orders?${orderIds
        .map((id) => `id=${id}`)
        .join('&')}`;

      fetch(fetchOrdersUrl)
        .then((resp) => resp.json())
        .then((data) => setOrders(data))
        .catch((error) => handleFetchError(error));
    }
  }, [JSON.stringify(orderIds)]);

  return { orders };
}
