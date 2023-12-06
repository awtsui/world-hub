'use client';

import { useCart } from '@/context/CartContext';
import { Dispatch, SetStateAction } from 'react';
import { Button } from './Button';
import { ChevronDown, ChevronUp, Delete, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

type ShoppingCartSliderProps = {
  open: boolean;
  setCartSliderIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ShoppingCartSlider({
  open,
  setCartSliderIsOpen,
}: ShoppingCartSliderProps) {
  const { items, removeItem } = useCart();
  const subTotal = items
    .reduce((acc, curr) => (acc += parseFloat(curr.price)), 0)
    .toFixed(2);

  function toggleSlider() {
    setCartSliderIsOpen(!open);
  }
  return (
    <div>
      <Button onClick={toggleSlider}>
        <div className="flex gap-2">
          <ShoppingCart />
          {open ? <ChevronUp /> : <ChevronDown />}
        </div>
      </Button>
      {open && (
        <div>
          <h1>Number of items: {items.length}</h1>
          {items.map((item) => (
            <div key={item.eventId}>
              <p>
                Event Name: {item.eventName} | Price: {item.price}{' '}
              </p>
              <Button onClick={() => removeItem(item.eventId)}>
                <Delete />
              </Button>
            </div>
          ))}
          <h1>Subtotal: {subTotal}</h1>
          <Link href="/checkout">
            <Button> Checkout</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
