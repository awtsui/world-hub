import { Event } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import EventCard from './app/EventCard';
import Link from 'next/link';

interface EventsCarouselProps {
  events: Event[];
}

export default function EventsCarousel({ events }: EventsCarouselProps) {
  return (
    <Carousel orientation="horizontal" className="w-full">
      <CarouselContent className="-ml-1">
        {events.map((event) => (
          <CarouselItem
            key={event.eventId}
            className="pl-2 md:basis-1/3 lg:basis-1/5"
          >
            <Link key={event.eventId} href={`/event/${event.eventId}`}>
              <EventCard event={event} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
