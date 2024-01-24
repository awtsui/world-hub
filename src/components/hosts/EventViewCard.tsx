import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Event, EventApprovalStatus } from '@/lib/types';
import { Button } from '../ui/button';
import Image from 'next/image';
import DateFormatter from '../DateFormatter';
import { HTMLAttributes } from 'react';

import { getMediaById, getVenueById } from '@/lib/actions';
import EventViewDialog from './EventViewDialog';

interface EventViewCardProps extends HTMLAttributes<HTMLDivElement> {
  event: Event;
}

export default async function EventViewCard({ event, ...props }: EventViewCardProps) {
  const venue = await getVenueById(event.venueId);
  const media = await getMediaById(event.mediaId);

  const borderColor =
    event.approvalStatus === EventApprovalStatus.Rejected
      ? 'border-red-600'
      : event.approvalStatus === EventApprovalStatus.Pending
        ? 'border-amber-400'
        : 'border-green-500';

  return (
    <Card {...props} className={`w-80 h-auto border-2 ${borderColor}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{event.title}</CardTitle>
          <p className={`font-medium`}>{event.approvalStatus}</p>
        </div>
        <CardDescription>
          {venue.city}, {venue.state} - {venue.name}
        </CardDescription>
        <CardDescription>
          <DateFormatter date={new Date(event.datetime)} />
        </CardDescription>
      </CardHeader>
      <CardContent className="relative w-full h-52">
        <Image src={media.url} alt={event.title} fill className="px-3 object-contain" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <EventViewDialog event={event} />
        {event.approvalStatus === EventApprovalStatus.Approved && (
          <a
            target="_blank"
            href={`//app.${process.env.NEXT_PUBLIC_URL}/event/${event.eventId}`}
            rel="noopener noreferrer"
          >
            <Button variant="outline">View in Marketplace</Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
