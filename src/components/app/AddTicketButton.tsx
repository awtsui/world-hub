'use client';
import { Event, TicketWithData, Tier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '../../context/CartContext';
import { useAlertDialog, useCartSheet } from '@/context/ModalContext';
import { useToast } from '../ui/use-toast';
import { ToastAction } from '../ui/toast';

type AddTicketButtonProps = {
  event: Event;
  tier: Tier;
};
export default function AddTicketButton({ event, tier }: AddTicketButtonProps) {
  const { addTicket } = useCart();
  const { onCartOpen } = useCartSheet();
  // const { setSuccess } = useAlertDialog();
  const { toast } = useToast();

  function addItemToCart(event: Event) {
    const newTicket: TicketWithData = {
      eventId: event.eventId,
      eventTitle: event.title,
      currency: event.currency,
      price: tier.price,
      label: tier.label,
      unitAmount: 1,
    };
    addTicket(newTicket);
    toast({
      title: 'Ticket added to cart',
      description: `${event.title} - ${tier.label} $${parseFloat(
        tier.price
      ).toFixed(2)}`,
      action: (
        <ToastAction altText="View in cart" onClick={() => onCartOpen()}>
          View in cart
        </ToastAction>
      ),
    });
  }

  return (
    <Button
      disabled={event.ticketsPurchased >= event.ticketQuantity}
      onClick={() => addItemToCart(event)}
    >
      Add to Cart
    </Button>
  );
}
