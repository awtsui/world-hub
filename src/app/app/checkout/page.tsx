'use client';

import getStripe from '../../../lib/stripe/utils/get-stripejs';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCart } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
import { Event } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAlertDialog } from '@/context/ModalContext';
import useFetchEvents from '@/hooks/useFetchEvents';
import useFetchProfile from '@/hooks/useFetchProfile';
import useFetchOrders from '@/hooks/useFetchOrders';
import useFetchStripeSession from '@/hooks/useFetchStripeSession';

export default function CheckoutPage() {
  const stripePromise = getStripe();
  const { tickets, resetCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { setError } = useAlertDialog();

  // 1. Gather list of events from user cart
  const eventIds: string[] = Object.values(tickets).map(
    (ticket) => ticket.eventId
  );

  // 2. Gather event ticket restrictions
  const { events } = useFetchEvents({ eventIds });

  const eventLimits: Record<string, number> = {};
  events.forEach((event: Event) => {
    eventLimits[event.eventId] = event.purchaseLimit;
  });

  // 3. Fetch user past orders and filter for events currently in cart
  const { profile } = useFetchProfile({ userId: session?.user?.id });

  const { orders } = useFetchOrders({ orderIds: profile?.orders });

  const pastRelevantTickets: Record<string, number> = {};
  orders.forEach((order) => {
    order.ticketData.forEach((ticket) => {
      if (Object.keys(pastRelevantTickets).includes(ticket.eventId)) {
        pastRelevantTickets[ticket.eventId] += ticket.unitAmount;
      } else {
        pastRelevantTickets[ticket.eventId] = ticket.unitAmount;
      }
    });
  });

  // 4. Verify if user is not making any invalid purchases
  const remainingTicketLimits: Record<string, number> = {};
  Object.entries(pastRelevantTickets).forEach(([key, value]) => {
    remainingTicketLimits[key] = eventLimits[key] - value;
  });

  let isValidOrder = true;
  Object.values(tickets).forEach((ticket) => {
    const limitLeft = remainingTicketLimits[ticket.eventId] - ticket.unitAmount;
    if (limitLeft < 0) {
      isValidOrder = false;
    }
  });

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
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
