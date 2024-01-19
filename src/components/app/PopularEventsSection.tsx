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
    .toSorted((a, b) => (a.totalSold > b.totalSold ? -1 : 1))
    .slice(0, 10);

  return (
    <div className="flex flex-col px-5 py-3">
      <p className="text-2xl font-bold pl-3">Trending</p>
      {popularEvents.length > 0 ? (
        <div className="pt-2">
          <EventsCarousel events={popularEvents} />
        </div>
      ) : (
        <div>No Events</div>
      )}
    </div>
  );
}
