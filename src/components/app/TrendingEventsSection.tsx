import EventsCarousel from '../EventsCarousel';
import { getTrendingEvents } from '@/lib/actions';
import { config } from '@/lib/config';

export default async function TrendingEventsSection() {
  const trendingEvents = await getTrendingEvents(config.TRENDING_EVENTS_LIMIT);

  return (
    <div data-testid="trending-events-section" className="flex flex-col px-5 py-3">
      <p className="text-2xl font-bold pl-3">Trending</p>
      {trendingEvents.length > 0 ? (
        <div className="pt-2">
          <EventsCarousel events={trendingEvents} />
        </div>
      ) : (
        <div>No Events</div>
      )}
    </div>
  );
}
