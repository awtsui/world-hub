import { Event } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../ui/card';
import { getMediaById, getVenueById } from '@/lib/actions';
import { HTMLAttributes } from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import { formatDayNumeric, formatMonthShort } from '@/lib/client/utils';

interface EventCardProps extends HTMLAttributes<HTMLDivElement> {
  event: Event;
}

export default async function EventCard({ event, ...props }: EventCardProps) {
  const venue = await getVenueById(event.venueId);
  const media = await getMediaById(event.mediaId);

  if (!venue || !media) {
    return null;
  }

  return (
    <div data-testid="event-card" className="w-[300px] h-auto flex-none">
      <Card {...props}>
        <CardContent className="pt-0 px-0 pb-2">
          <AspectRatio ratio={16 / 9}>
            <Image src={media.url} alt={event.title} fill className="object-cover rounded-t-lg" />
          </AspectRatio>
        </CardContent>
        <CardFooter className="flex items-center gap-3 px-3 pb-3 pt-0">
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-center w-[40px]">{formatMonthShort(event.datetime)}</p>
            <p className="text-xl font-bold text-center w-[40px]">{formatDayNumeric(event.datetime)}</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="line-clamp-1 font-bold">{event.title}</p>
            <p className="line-clamp-1  text-slate-500">
              {venue.name} &#x2022; {venue.city}, {venue.state}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
