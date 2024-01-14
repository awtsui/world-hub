'use client';

import TicketViewCard from '@/components/app/TicketViewCard';
import { fetcher } from '@/lib/client/utils';
import { TicketWithHash } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

export default function CheckoutViewOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  if (!orderId) return <div>View order ran into an unexpected problem</div>;

  const { data: order, error: fetchOrderError } = useSWR(
    `/api/orders?id=${orderId}`,
    fetcher
  );

  const { data: tickets, error: fetchTicketsError } = useSWR(
    order && order[0].tickets
      ? `/api/tickets?${order[0].tickets
          .map((id: string) => `id=${id}`)
          .join('&')}`
      : '',
    fetcher
  );

  return (
    <div className="px-12 py-4">
      <p className="text-3xl">View Order</p>
      <div className="py-5">
        {tickets ? (
          <div className="flex flex-wrap gap-5 pt-8">
            {tickets.map((ticket: TicketWithHash) => (
              <TicketViewCard ticket={ticket} />
            ))}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
