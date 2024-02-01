'use client';

import getStripe from '@/lib/stripe/utils/get-stripejs';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { WorldIdVerificationLevel } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useAlertDialog } from '@/context/ModalContext';
import useFetchStripeSession from '@/hooks/useFetchStripeSession';
import useFetchEventsByIds from '@/hooks/useFetchEventsByIds';
import useFetchUserProfileById from '@/hooks/useFetchUserProfileById';
import useFetchOrdersByIds from '@/hooks/useFetchOrdersByIds';

export default function CheckoutPage() {
  const stripePromise = getStripe();
  const { tickets, resetCart, isLoading } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { setError } = useAlertDialog();
  const eventLimits: Record<string, number> = {};
  const pastRelevantTickets: Record<string, number> = {};
  const remainingTicketLimits: Record<string, number> = {};
  let isValidOrder = false;
  let isValidVerification = false;

  // Redirect if cart is empty
  if (!isLoading && !Object.values(tickets).length) {
    router.push('/marketplace');
    setError('Empty cart', 3);
  }

  // 1. Gather list of events from user cart
  const eventIds: string[] = Object.values(tickets).map((ticket) => ticket.eventId);

  // 2. Gather event ticket restrictions and redirect if user verification level does not meet the events requirements
  const events = useFetchEventsByIds(eventIds);

  if (events && events.length && session) {
    let tempIsValidVerification = true;
    events.forEach((event) => {
      eventLimits[event.eventId] = event.purchaseLimit;
      if (
        event.verificationLevel === WorldIdVerificationLevel.Orb &&
        session.user &&
        (!session.user.verificationLevel || session.user.verificationLevel === WorldIdVerificationLevel.Device)
      ) {
        tempIsValidVerification = false;
      }
    });
    if (!tempIsValidVerification) {
      router.push('/marketplace');
      setError('User does not meet event verification requirements', 3);
      resetCart();
    } else {
      isValidVerification = tempIsValidVerification;
    }
  }

  // 3. Fetch user past orders and filter for events currently in cart

  const profile = useFetchUserProfileById(session?.user?.id);

  const orders = useFetchOrdersByIds(profile?.orders);

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

  // 4. Verify if user is not making any invalid purchases
  if (Object.entries(pastRelevantTickets).length || Object.entries(eventLimits).length) {
    Object.entries(eventLimits).forEach(([key, value]) => {
      remainingTicketLimits[key] = value;
    });
    Object.entries(pastRelevantTickets).forEach(([key, value]) => {
      if (Object.keys(eventLimits).includes(key)) {
        remainingTicketLimits[key] = eventLimits[key] - value;
      }
    });
  }

  if (Object.values(tickets).length && Object.entries(remainingTicketLimits).length) {
    let tempIsValidOrder = true;
    Object.values(tickets).forEach((ticket) => {
      const limitLeft = remainingTicketLimits[ticket.eventId] - ticket.unitAmount;
      if (limitLeft < 0) {
        tempIsValidOrder = false;
      }
    });
    // 5. If invalid, prompt user to alter cart to meet restrictions and redirect to home page
    if (!tempIsValidOrder) {
      router.push('/marketplace');
      setError('Order does not meet event limit restrictions', 3);
      resetCart();
    } else {
      isValidOrder = tempIsValidOrder;
    }
  }

  // 6. Request Stripe session
  const { clientSecret } = useFetchStripeSession({
    tickets: Object.values(tickets),
    userId: session?.user?.id,
    email: session?.user?.email,
    isValidOrder,
    isValidVerification,
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
