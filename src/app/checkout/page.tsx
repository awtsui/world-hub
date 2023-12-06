'use client';

import getStripe from '../../utils/get-stripejs';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const stripePromise = getStripe();
  const [clientSecret, setClientSecret] = useState('');
  const { items } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/stripe/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems: items, userId: session?.user?.id }),
    })
      .then((resp) => resp.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div>
      {clientSecret ? (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
