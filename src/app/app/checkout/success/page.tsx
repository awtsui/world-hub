'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CheckoutSuccessPage() {
  const { resetCart } = useCart();

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const URL = sessionId ? `/api/stripe/sessions/?id=${sessionId}` : null;
  const { data, error, isLoading } = useSWR(URL, fetcher);

  // TODO: Redirect to a error page
  if (error) return <div>Checkout failed unexpectedly...</div>;

  return (
    <div>
      {!isLoading ? (
        <div>
          <h1>Checkout Payment Result</h1>
          <h2>Status: {data.status ?? 'loading...'}</h2>
          <p>
            Your Order Number: <code>{data.order_id}</code>
          </p>
          <p>Payment Status: {data.payment_status}</p>
          <p>Customer Email: {data.customer_email}</p>
          <p>
            <Link href="/">Go home</Link>
          </p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
