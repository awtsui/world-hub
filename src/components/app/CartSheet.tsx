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
import { formatPrice } from '@/lib/client/utils';

export default function CartSheet() {
  const { tickets, removeTicket } = useCart();
  const { isCartOpen, onCartClose } = useCartSheet();

  const subTotal = Object.values(tickets).reduce(
    (total, item) => total.plus(Big(item.price).times(item.unitAmount)),
    Big('0.0')
  );

  const isDisabled = tickets && !Object.values(tickets).length;

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
          <div className="flex flex-col py-5">
            <div className="flex flex-col pb-3 px-2">
              {Object.values(tickets).map((ticket) => (
                <div
                  key={`${ticket.eventId}-${ticket.label}`}
                  className="grid grid-cols-6 grid-flow-row-dense py-2 items-center"
                >
                  <div className="flex flex-col col-span-3">
                    <p>{ticket.eventTitle}</p>
                    <p>{ticket.label}</p>
                  </div>
                  <p>{formatPrice(ticket.price)}</p>

                  <p className="text-center">{ticket.unitAmount}</p>
                  <div className="mx-auto">
                    <Button
                      variant={'ghost'}
                      className="rounded-full"
                      size={'icon'}
                      onClick={() => removeTicket(ticket.eventId, ticket.label)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="flex flex-col gap-2 py-4 pl-2 pr-5">
              <div className="flex justify-between items-center">
                <p className="text-md text-slate-500">Subtotal</p>
                <p className="text-md">${subTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-md text-slate-500">Shipping</p>
                <p className="text-md">Free</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Total</p>
                <p className="text-lg font-bold">${subTotal.toFixed(2)}</p>
              </div>
            </div>
            <hr />
          </div>
          <div className="flex gap-2">
            <Link href="/cart" className="w-full">
              <Button
                variant="secondary"
                className="w-full"
                onClick={onCartClose}
              >
                View Cart
              </Button>
            </Link>
            <Button
              className="w-full"
              disabled={isDisabled}
              onClick={onCartClose}
            >
              <Link href="/checkout" className="w-full">
                Checkout
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
