'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/client/utils';
import Big from 'big.js';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { tickets, removeTicket } = useCart();

  const isDisabled = tickets && !Object.values(tickets).length;

  const subTotal = Object.values(tickets).reduce(
    (total, item) => total.plus(Big(item.price).times(item.unitAmount)),
    Big('0.0')
  );

  return (
    <div className="flex flex-col items-center w-full px-12 py-4 gap-4">
      <div className="py-6">
        <p className="text-3xl">Shopping Cart</p>
      </div>
      <div className="flex justify-center w-full pt-6 gap-20">
        <div className="flex flex-col gap-3 w-3/5 max-w-2xl min-w-min">
          <div className="flex flex-col gap-3">
            <div className="grid grid-flow-row-dense grid-cols-7">
              <p className="col-span-3 pl-2">Event</p>
              <p className="text-center">Price</p>
              <p className="text-center">Quantity</p>
              <p className="text-center">Total</p>
              <p></p>
            </div>
            <hr />
          </div>
          {Object.entries(tickets).map(([ticketId, ticket]) => (
            <div key={ticketId} className="flex flex-col gap-3">
              <div className="grid grid-cols-7 items-center">
                <Link
                  href={`/event/${ticket.eventId}`}
                  className="hover:underline col-span-3 pl-2"
                >
                  {ticket.eventTitle} - {ticket.label}
                </Link>
                <p className="text-center">{formatPrice(ticket.price)}</p>
                <p className="text-center">{ticket.unitAmount}</p>

                <p className="text-center">
                  {formatPrice(
                    Big(ticket.price).times(ticket.unitAmount).toString()
                  )}
                </p>
                <div className="mx-auto">
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    size={'icon'}
                    onClick={() => removeTicket(ticket.eventId, ticket.label)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
        <div className="flex flex-col w-1/5 max-w-sm min-w-min gap-2 pt-9">
          <div className="bg-slate-50 ">
            <div className="px-4 py-2 border-2">
              <p className="text-lg">Order Summary</p>
            </div>
            <div className="py-2 border-x-2 border-b-2">
              <div className="flex items-center justify-between px-4 py-1">
                <p className="text-md text-slate-500">Subtotal</p>
                <p className="text-md">${subTotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between px-4 py-1">
                <p className="text-md text-slate-500">Shipping</p>
                <p className="text-md">Free</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-x-2 border-b-2">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">${subTotal.toFixed(2)}</p>
            </div>
          </div>
          <Button className="w-full" disabled={isDisabled}>
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
