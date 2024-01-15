'use client';

import TicketViewCard from '@/components/app/TicketViewCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { TicketWithHash } from '@/lib/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CheckoutSuccessPage() {
  const { resetCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const URL = sessionId ? `/api/stripe/sessions/?id=${sessionId}` : null;
  const { data: sessionData, error, isLoading } = useSWR(URL, fetcher);

  const { data: order, error: fetchOrderError } = useSWR(
    sessionData ? `/api/orders?id=${sessionData.order_id}` : '',
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

  // TODO: Redirect to a error page
  if (error) return <div>Checkout failed unexpectedly...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="px-12 py-4">
      <div className="flex justify-between items-center">
        <p className="text-3xl">View Order</p>
        <Button>Download Tickets</Button>
      </div>

      <div className="pt-5">
        <p>Status: {sessionData.status ?? 'loading...'}</p>
        <p>
          Your Order Number: <code>{sessionData.order_id}</code>
        </p>
        <p>Customer Email: {sessionData.customer_email}</p>
      </div>

      <div className="py-5">
        {tickets && (
          <div className="flex flex-wrap gap-5 pt-8">
            {tickets.map((ticket: TicketWithHash) => (
              <TicketViewCard ticket={ticket} />
            ))}
          </div>
        )}
      </div>
      <Button onClick={() => router.push('/')} variant={'secondary'}>
        Go back to Marketplace
      </Button>
    </div>
  );
}
