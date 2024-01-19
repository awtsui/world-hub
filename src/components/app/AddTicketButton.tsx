'use client';
import { Event, TicketWithData, Tier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '../../context/CartContext';
import { useCartSheet } from '@/context/ModalContext';
import { useToast } from '../ui/use-toast';
import { ToastAction } from '../ui/toast';

type AddTicketButtonProps = {
  event: Event;
  tier: Tier;
  setOpen: (state: boolean) => void;
};
export default function AddTicketButton({
  event,
  tier,
  setOpen,
}: AddTicketButtonProps) {
  const { addTicket } = useCart();
  const { onCartOpen } = useCartSheet();
  // const { setSuccess } = useAlertDialog();
  const { toast } = useToast();

  function addItemToCart() {
    const newTicket: TicketWithData = {
      eventId: event.eventId,
      eventTitle: event.title,
      currency: event.currency,
      price: tier.price,
      label: tier.label,
      unitAmount: 1,
    };
    setOpen(false);
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
    <>
      {tier.ticketsPurchased < tier.quantity ? (
        <Button onClick={() => addItemToCart()}>Add to Cart</Button>
      ) : (
        <Button disabled={true}>Sold Out</Button>
      )}
    </>
  );
}
