'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { useCart } from '@/context/CartContext';
import { useCartSheet } from '@/context/ModalContext';

export default function CartButton() {
  const { tickets } = useCart();
  const { onCartOpen } = useCartSheet();
  const numberOfTickets = Object.values(tickets).reduce((acc, curr) => acc + curr.unitAmount, 0);

  return (
    <Button data-testid="cart-button" className="flex gap-3" onClick={onCartOpen}>
      <ShoppingCart />
      {numberOfTickets}
    </Button>
  );
}
