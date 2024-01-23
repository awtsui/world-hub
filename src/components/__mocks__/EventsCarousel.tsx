import { Event } from '@/lib/types';

export interface EventsCarouselProps {
  events: Event[];
}

export default function EventsCarousel({ events }: EventsCarouselProps) {
  return <div data-testid="events-carousel">mock</div>;
}
