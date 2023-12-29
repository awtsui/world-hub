'use client';
import { useCart } from '@/context/CartContext';
import { Button } from './Button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartButton() {
  const { tickets } = useCart();
  let numOfItems = 0;

  tickets.forEach((ticket) => {
    numOfItems += ticket.unitAmount;
  });

  return (
    <Link href="/cart">
      <Button className="flex gap-3">
        <ShoppingCart />
        {numOfItems}
      </Button>
    </Link>
  );
}
