'use client';

import getStripe from '../../../lib/stripe/utils/get-stripejs';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useCart } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
import { Event, Order, UserProfile, WorldIdVerificationLevel } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAlertDialog } from '@/context/ModalContext';
import useFetchStripeSession from '@/hooks/useFetchStripeSession';
import useSWR from 'swr';
import { fetcher } from '@/lib/client/utils';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const stripePromise = getStripe();
  const { tickets, resetCart, isLoading } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { setError } = useAlertDialog();
  const [isValidVerification, setIsValidVerification] = useState(true);
  const eventLimits: Record<string, number> = {};
  const pastRelevantTickets: Record<string, number> = {};
  const remainingTicketLimits: Record<string, number> = {};
  const [isValidOrder, setIsValidOrder] = useState(true);

  // Redirect if cart is empty
  if (!isLoading && !Object.values(tickets).length) {
    router.push('/marketplace');
    setError('Empty cart', 3);
  }

  // 1. Gather list of events from user cart
  const eventIds: string[] = Object.values(tickets).map((ticket) => ticket.eventId);

  // 2. Gather event ticket restrictions and redirect if user verification level does not meet the events requirements
  // const { events } = useFetchEvents({ eventIds });
  const eventsSearchUrl = `/api/events?${eventIds.map((id) => `id=${id}`).join('&')}`;

  const { data: events } = useSWR<Event[]>(eventsSearchUrl, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    if (events && session) {
      events.forEach((event: Event) => {
        eventLimits[event.eventId] = event.purchaseLimit;
        if (
          event.verificationLevel === WorldIdVerificationLevel.Orb &&
          session.user &&
          (!session.user.verificationLevel || session.user.verificationLevel === WorldIdVerificationLevel.Device)
        ) {
          setIsValidVerification(false);
        }
      });
    }
  }, [JSON.stringify(events), JSON.stringify(session), eventLimits]);

  if (!isValidVerification) {
    setError('User does not meet event verification requirements', 3);
    resetCart();
    router.push('/marketplace');
  }

  // 3. Fetch user past orders and filter for events currently in cart
  // const { profile } = useFetchProfile({ userId: session?.user?.id });

  const { data: profile } = useSWR<UserProfile>(
    session && session.user ? `/api/users/profile?id=${session.user.id}` : '',
    fetcher,
  );

  // const { orders } = useFetchOrders({ orderIds: profile?.orders });
  const fetchOrdersUrl =
    profile && profile.orders && profile.orders.length
      ? `/api/orders?${profile.orders.map((id: string) => `id=${id}`).join('&')}`
      : '';

  const { data: orders } = useSWR<Order[]>(fetchOrdersUrl, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    if (orders && orders.length) {
      orders.forEach((order) => {
        order.ticketData.forEach((ticket) => {
          if (Object.keys(pastRelevantTickets).includes(ticket.eventId)) {
            pastRelevantTickets[ticket.eventId] += ticket.unitAmount;
          } else {
            pastRelevantTickets[ticket.eventId] = ticket.unitAmount;
          }
        });
      });
    }
  }, [JSON.stringify(orders), JSON.stringify(pastRelevantTickets)]);

  // 4. Verify if user is not making any invalid purchases
  useEffect(() => {
    if (Object.entries(pastRelevantTickets)) {
      Object.entries(pastRelevantTickets).forEach(([key, value]) => {
        remainingTicketLimits[key] = eventLimits[key] - value;
      });
    }
  }, [JSON.stringify(pastRelevantTickets), JSON.stringify(eventLimits), JSON.stringify(remainingTicketLimits)]);

  useEffect(() => {
    if (tickets && Object.values(tickets) && Object.entries(pastRelevantTickets)) {
      Object.values(tickets).forEach((ticket) => {
        const limitLeft = remainingTicketLimits[ticket.eventId] - ticket.unitAmount;
        if (limitLeft < 0) {
          setIsValidOrder(false);
        }
      });
    }
  }, [JSON.stringify(tickets), JSON.stringify(remainingTicketLimits)]);

  // 5. If invalid, prompt user to alter cart to meet restrictions and redirect to home page
  if (!isValidOrder) {
    setError('Order does not meet event limit restrictions', 3);
    resetCart();
    router.push('/marketplace');
  }

  // 6. Request Stripe session
  const { clientSecret } = useFetchStripeSession({
    tickets: Object.values(tickets),
    userId: session?.user?.id,
    email: session?.user?.email,
    isValidOrder,
  });

  return (
    <>
      {clientSecret ? (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
