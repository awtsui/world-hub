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
import { AspectRatio } from '../ui/aspect-ratio';

interface EventCardProps extends HTMLAttributes<HTMLDivElement> {
  event: Event;
}

export default async function EventCard({ event, ...props }: EventCardProps) {
  const venue = await getVenueById(event.venueId);

  return (
    <div className="w-[300px] h-auto flex-none">
      <Card {...props}>
        <CardContent className="px-3 pt-3 pb-2">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={event.thumbnailUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </AspectRatio>
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
    </div>
  );
}
