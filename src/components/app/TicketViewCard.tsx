'use client';

import { TicketWithHash } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import TicketQRCode from '../TicketQRCode';
import useSWR from 'swr';
import { fetcher, formatDate } from '@/lib/client/utils';

interface TicketViewCardProps {
  ticket: TicketWithHash;
}

export default function TicketViewCard({ ticket }: TicketViewCardProps) {
  const { data: event } = useSWR(`/api/events?id=${ticket.eventId}`, fetcher);
  const { data: venue } = useSWR(event ? `/api/venues?id=${event[0].venueId}` : '', fetcher);

  if (!event || !venue) {
    return null;
  }

  const venueAddress = `${venue.address} ${venue.city}, ${venue.state} ${venue.zipcode}`;

  return (
    <Card className="w-80 h-auto">
      <CardHeader className="flex-row justify-center pb-2">
        <div className="border-2 rounded-lg p-2">
          <TicketQRCode ticketHash={ticket.hash} />
        </div>
      </CardHeader>
      <CardContent className="py-2 flex flex-col items-center ">
        <div className="flex flex-col items-center w-full px-4">
          <p className="text-3xl">{event[0].title}</p>
          <p className="text-2xl text-slate-500">{ticket.label}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <div className="py-2">
          <p className="text-slate-500 text-sm">Date & Time</p>
          <p className="font-bold text-md">{formatDate(event.datetime)}</p>
        </div>
        <div className="py-2">
          <p className="text-slate-500 text-sm">Venue Details</p>
          <p className="font-bold text-md">{venue.name}</p>
          <p className="font-bold text-md">{venueAddress}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
