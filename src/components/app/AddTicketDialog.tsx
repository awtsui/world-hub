'use client';

import { Event, Tier, WorldIdVerificationLevel } from '@/lib/types';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { formatPrice } from '@/lib/client/utils';
import { useState } from 'react';
import AddTicketButton from './AddTicketButton';
import { useSession } from 'next-auth/react';

interface AddTicketDialogProps {
  event: Event;
}

export default function AddTicketDialog({ event }: AddTicketDialogProps) {
  const [selectedTicket, setSelectedTicket] = useState<Tier | null>(null);
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const isValidVerificationLevel =
    !(
      event.verificationLevel === WorldIdVerificationLevel.Orb &&
      session?.user?.verificationLevel === WorldIdVerificationLevel.Device
    ) || !session;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setSelectedTicket(null)} disabled={!isValidVerificationLevel}>
          Purchase a ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
          <DialogDescription className="text-md">{event.subTitle}</DialogDescription>
        </DialogHeader>
        <div>
          <p>Tickets Available</p>
          <div className="py-5 space-y-3">
            {event.ticketTiers.map((tier) => (
              <Button
                key={tier.label}
                variant="outline"
                className={`flex w-full justify-between px-4 py-2 outline outline-1 rounded-md ${
                  selectedTicket?.label === tier.label ? 'bg-slate-100' : 'bg-white'
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
              <AddTicketButton event={event} tier={selectedTicket} setOpen={setOpen} />
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
