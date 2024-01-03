'use client';

import getStripe from '../../utils/get-stripejs';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Event, Order, Ticket } from '@/types';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import { handleFetchError } from '@/utils/client-helper';

export default function CheckoutPage() {
  const stripePromise = getStripe();
  const [clientSecret, setClientSecret] = useState('');
  const { tickets, resetCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { setError } = useAlert();
  const [eventLimits, setEventLimits] = useState<Record<string, number>>({});
  const [pastRelevantTickets, setPastRelevantTickets] = useState<
    Record<string, number>
  >({});
  const [isEligibleForCheckout, setIsEligibleForCheckout] = useState(false);

  // 1. Gather list of events from user cart
  const eventIds: string[] = Object.values(tickets).map(
    (ticket) => ticket.eventId
  );

  useEffect(() => {
    // 2. Gather event ticket restrictions
    const eventsSearchUrl = new URL('http:/localhost:3000/api/events');
    eventIds.forEach((id) => {
      eventsSearchUrl.searchParams.set('id', id);
    });
    fetch(eventsSearchUrl)
      .then((resp) => resp.json())
      .then((data) => {
        const eventLimits: Record<string, number> = {};
        data.forEach((event: Event) => {
          eventLimits[event.eventId] = event.ticketLimit;
        });
        setEventLimits(eventLimits);
      })
      .catch((error) => handleFetchError(error));

    // 3. Fetch user past orders and filter for events currently in cart
    async function fetchRelevantOrders() {
      try {
        const userSearchUrl = new URL('http:/localhost:3000/api/users');
        userSearchUrl.searchParams.set('worldId', session?.user?.id || '');
        const userSearchResp = await fetch(userSearchUrl);
        const userSearchData = await userSearchResp.json();

        const orderIds: string[] = userSearchData.orders;
        const ordersSearchUrl = new URL('http:/localhost:3000/api/orders');
        orderIds.forEach((orderId) => {
          ordersSearchUrl.searchParams.set('id', orderId);
        });
        const orderSearchResp = await fetch(ordersSearchUrl);
        const orderSearchData: Order[] = await orderSearchResp.json();
        const pastRelevantTickets: Record<string, number> = {};
        orderSearchData.forEach((order) => {
          order.tickets.forEach((ticket) => {
            if (Object.keys(pastRelevantTickets).includes(ticket.eventId)) {
              pastRelevantTickets[ticket.eventId] += ticket.unitAmount;
            } else {
              pastRelevantTickets[ticket.eventId] = ticket.unitAmount;
            }
          });
        });
        setPastRelevantTickets(pastRelevantTickets);
      } catch (error) {
        handleFetchError(error);
      }
    }
    if (session?.user?.id) {
      fetchRelevantOrders();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    // 4. Verify if user is not making any invalid purchases
    const remainingTicketLimits: Record<string, number> = {};
    Object.entries(pastRelevantTickets).forEach(([key, value]) => {
      remainingTicketLimits[key] = eventLimits[key] - value;
    });

    let isValidOrder = true;
    Object.values(tickets).forEach((ticket) => {
      const limitLeft =
        remainingTicketLimits[ticket.eventId] - ticket.unitAmount;
      if (limitLeft < 0) {
        isValidOrder = false;
      }
    });
    // 5. If invalid, prompt user to alter cart to meet restrictions and redirect to home page
    if (!isValidOrder) {
      setError('Order does not meet event limit restrictions', 3);
      resetCart();
      router.push('/marketplace');
    } else {
      setIsEligibleForCheckout(true);
    }
  }, [
    JSON.stringify(eventLimits),
    JSON.stringify(pastRelevantTickets),
    resetCart,
  ]);

  useEffect(() => {
    // 6. Request Stripe session
    if (isEligibleForCheckout && session?.user?.id) {
      fetch('/api/stripe/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickets: Object.values(tickets),
          userId: session?.user?.id,
        }), // TODO: Add more fields
      })
        .then((resp) => resp.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => handleFetchError(error));
    }
  }, [isEligibleForCheckout, session?.user?.id]);

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
