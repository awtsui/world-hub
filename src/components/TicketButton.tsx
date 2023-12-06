'use client';
import { Event } from '@/types';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext';

type TicketButtonProps = {
  event: Event;
};
export default function TicketButton({ event }: TicketButtonProps) {
  const { items, addItem } = useCart();
  const { setSuccess, setError } = useAlert();

  function addItemToCart(event: Event) {
    const found = items.find((item) => item.eventId === event.eventId);
    if (found) {
      setError(`Ticket for ${event.eventName} has already been added`, 3);
      return;
    }
    setSuccess(`Ticket for ${event.eventName} has been added!`, 3);
    addItem(event);
  }

  return (
    <div>
      <Button onClick={() => addItemToCart(event)}>Add to Cart</Button>
    </div>
  );
}
