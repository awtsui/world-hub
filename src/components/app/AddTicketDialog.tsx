'use client';

import { Event, Tier } from '@/lib/types';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { formatPrice } from '@/lib/client/utils';
import { useState } from 'react';
import AddTicketButton from './AddTicketButton';

interface AddTicketDialogProps {
  event: Event;
}

export default function AddTicketDialog({ event }: AddTicketDialogProps) {
  const [selectedTicket, setSelectedTicket] = useState<Tier | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setSelectedTicket(null)}>
          Purchase a ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {event.title}: {event.subTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="px-2">
          <p>Tickets Available</p>
          <div className="py-5">
            {event.ticketTiers.map((tier) => (
              <Button
                key={tier.label}
                variant="outline"
                className={`flex w-full justify-between px-4 py-2 outline outline-1 rounded-md ${
                  selectedTicket?.label === tier.label
                    ? 'bg-slate-100'
                    : 'bg-white'
                }`}
                onClick={() => setSelectedTicket(tier)}
              >
                <p>{tier.label}</p>
                <p>{formatPrice(tier.price)}</p>
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          {selectedTicket && (
            <DialogClose asChild>
              <AddTicketButton
                event={event}
                tier={selectedTicket}
                setOpen={setOpen}
              />
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
