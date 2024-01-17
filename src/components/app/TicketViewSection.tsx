import { TicketWithHash } from '@/lib/types';
import TicketViewCard from './TicketViewCard';
import React from 'react';

interface TicketViewSectionProps {
  tickets: TicketWithHash[];
}

export default function TicketViewSection({ tickets }: TicketViewSectionProps) {
  return (
    <div className="flex flex-wrap gap-5">
      {tickets.map((ticket: TicketWithHash) => (
        <div key={ticket.hash}>
          {ticket.hash && <TicketViewCard key={ticket.hash} ticket={ticket} />}
        </div>
      ))}
    </div>
  );
}
