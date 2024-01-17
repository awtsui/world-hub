import { MainCategory, SubCategory, Event } from '@/lib/types';
import Link from 'next/link';
import EventsCarousel from '../EventsCarousel';

type PopularEventsSectionProps = {
  events: Event[];
};

export default function PopularEventsSection({
  events,
}: PopularEventsSectionProps) {
  const popularEvents = events
    .toSorted((a, b) => (a.ticketsPurchased > b.ticketsPurchased ? -1 : 1))
    .slice(0, 10);

  return (
    <div className="px-5 py-5">
      {popularEvents.length > 0 && <EventsCarousel events={popularEvents} />}
    </div>
  );
}
