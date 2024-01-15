'use client';

import { handleFetchError } from '@/lib/client/utils';
import { TicketWithData } from '@/lib/types';
import { useEffect, useState } from 'react';

interface useFetchStripeSessionParams {
  tickets?: TicketWithData[];
  userId?: string;
  email?: string | null;
  isValidOrder: boolean;
}

export default function useFetchStripeSession({
  tickets,
  userId,
  email,
  isValidOrder,
}: useFetchStripeSessionParams) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (userId && tickets && tickets.length && isValidOrder) {
      fetch('/api/stripe/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickets: Object.values(tickets),
          userId,
          email: email ?? '',
        }),
      })
        .then((resp) => resp.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => handleFetchError(error));
    }
  }, [userId, JSON.stringify(tickets), isValidOrder]);

  return { clientSecret };
}
