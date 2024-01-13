'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '../ui/button';
import Link from 'next/link';
import Big from 'big.js';
import { useCartSheet } from '@/context/ModalContext';

export default function CartSheet() {
  const { tickets, removeTicket } = useCart();
  const { isCartOpen, onCartClose } = useCartSheet();

  const subTotal = Object.values(tickets).reduce(
    (total, item) => total.plus(Big(item.price).times(item.unitAmount)),
    Big('0.0')
  );

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={onCartClose}
      defaultOpen={isCartOpen}
    >
      <SheetContent
        side="right"
        className="flex flex-col h-full w-full space-y-4 px-3 py-6 "
      >
        <SheetHeader>
          <SheetTitle className="text-center">Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1">
          <div className="flex flex-col py-4">
            <div className="flex flex-col py-4 px-2">
              {Object.values(tickets).map((ticket) => (
                <div
                  key={`${ticket.eventId}-${ticket.label}`}
                  className="flex py-2 justify-between"
                >
                  <div className="flex flex-col">
                    <p>{ticket.eventTitle}</p>
                    <p>${parseFloat(ticket.price).toFixed(2)}</p>
                  </div>
                  <p>
                    {ticket.unitAmount} {ticket.label}
                  </p>
                  <Button
                    variant={'ghost'}
                    onClick={() => removeTicket(ticket.eventId, ticket.label)}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
            <hr />
            <div className="flex flex-col gap-2 py-4 px-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${subTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>${subTotal.toFixed(2)}</p>
              </div>
            </div>
            <hr />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Link href="/cart" className="w-full">
              <Button className="w-full">View Shopping Cart</Button>
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
