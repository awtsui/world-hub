'use client';
import { useCart } from '@/context/CartContext';
import { Button } from './Button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartButton() {
  const { tickets } = useCart();

  return (
    <Link href="/cart">
      <Button className="flex gap-3">
        <ShoppingCart />
        {Object.values(tickets).reduce((acc, curr) => acc + curr.unitAmount, 0)}
      </Button>
    </Link>
  );
}
