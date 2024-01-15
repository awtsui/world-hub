import { Event } from '@/lib/types';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import DateFormatter from '../DateFormatter';
import { getVenueById } from '@/lib/actions';
import { HTMLAttributes } from 'react';

interface EventCardProps extends HTMLAttributes<HTMLDivElement> {
  event: Event;
}

export default async function EventCard({ event, ...props }: EventCardProps) {
  const venue = await getVenueById(event.venueId);

  return (
    <Card {...props}>
      <CardContent className="px-3 pt-3 pb-2">
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          width={300}
          height={200}
          className="object-cover"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start px-3 pb-3 pt-0">
        <DateFormatter date={new Date(event.datetime)} />
        <CardTitle>
          {event.lineup[0]}: {event.title}
        </CardTitle>
        {venue && (
          <CardDescription>
            {venue.city}, {venue.state} - {venue.name}
          </CardDescription>
        )}
      </CardFooter>
    </Card>
  );
}
