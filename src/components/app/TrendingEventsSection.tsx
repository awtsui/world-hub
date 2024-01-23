import { Event } from '@/lib/types';
import EventsCarousel from '../EventsCarousel';

interface TrendingEventsSectionProps {
  events: Event[];
}

export default function TrendingEventsSection({ events }: TrendingEventsSectionProps) {
  const popularEvents = events.toSorted((a, b) => (a.totalSold > b.totalSold ? -1 : 1)).slice(0, 10);

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
