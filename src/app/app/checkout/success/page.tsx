'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import TicketViewSection from '@/components/app/TicketViewSection';
import ReactToPrint from 'react-to-print';
import { useSession } from 'next-auth/react';
import { useAlertDialog } from '@/context/ModalContext';
import { formatPrice } from '@/lib/client/utils';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CheckoutSuccessPage() {
  const { resetCart } = useCart();
  const router = useRouter();
  const ticketSectionRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { setError } = useAlertDialog();

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const URL = sessionId ? `/api/stripe/sessions/?id=${sessionId}` : '';
  const { data: sessionData } = useSWR(URL, fetcher);

  const { data: order } = useSWR(
    sessionData ? `/api/orders?id=${sessionData.order_id}` : '',
    fetcher
  );

  const { data: tickets } = useSWR(
    order && order[0].tickets
      ? `/api/tickets?${order[0].tickets
          .map((id: string) => `id=${id}`)
          .join('&')}`
      : '',
    fetcher
  );

  if (session?.user?.id && order && session.user.id !== order[0].userId) {
    setError('Not authorized to view this order', 3);
    router.push('/marketplace');
  }

  // TODO: Redirect to a error page
  if (!order || !tickets || !sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-3/5 mx-auto py-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-3xl">View Order</p>
          <div className="pt-6">
            <p className="text-2xl pb-4">Order Information</p>
            <div className="pl-4">
              <p>
                Order Number: <code>{sessionData.order_id}</code>
              </p>
              <p>
                Status: <code>{sessionData.status}</code>
              </p>
              <p>
                Email: <code>{sessionData.customer_email}</code>
              </p>
              <p>
                Total Price: <code>{formatPrice(order[0].totalPrice)}</code>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Button
            onClick={() => router.push('/marketplace')}
            variant={'secondary'}
          >
            Back to Marketplace
          </Button>
          <ReactToPrint
            trigger={() => <Button>Download Tickets</Button>}
            content={() => ticketSectionRef.current}
          />
        </div>
      </div>

      <div className="pt-8 space-y-4">
        <p className="text-2xl font-bold">Your Tickets ( {tickets.length} )</p>
        <div ref={ticketSectionRef} className="py-2 px-4">
          <TicketViewSection tickets={tickets} />
        </div>
      </div>
    </div>
  );
}
