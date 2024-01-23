import { Event } from '@/lib/types';

export interface TrendingEventsSectionProps {
  events: Event[];
}

export default function TrendingEventsSection({ events }: TrendingEventsSectionProps) {
  return <div data-testid="trending-events-section">mock</div>;
}
