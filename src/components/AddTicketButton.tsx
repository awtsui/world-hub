'use client';
import { Event, Ticket, Tier } from '@/types';
import { Button } from './Button';
import { useCart } from '../context/CartContext';

type AddTicketButtonProps = {
  event: Event;
  tier: Tier;
};
export default function AddTicketButton({ event, tier }: AddTicketButtonProps) {
  const { addTicket } = useCart();

  function addItemToCart(event: Event) {
    const newTicket: Ticket = {
      eventId: event.eventId,
      eventTitle: event.title,
      currency: event.currency,
      price: tier.price,
      label: tier.label,
      unitAmount: 1,
    };
    addTicket(newTicket);
  }

  return <Button onClick={() => addItemToCart(event)}>Add to Cart</Button>;
}
