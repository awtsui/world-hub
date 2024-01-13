import { Event, HostProfile } from '@/lib/types';
import { Separator } from '../ui/separator';
import Link from 'next/link';

interface DashboardAnalyticsSectionProps {
  hostProfile: HostProfile;
  events: Event[];
}

export default function DashboardAnalyticsSection({
  hostProfile,
  events,
}: DashboardAnalyticsSectionProps) {
  const today = new Date();
  const upcomingEvents = events.reduce(
    (total, event) =>
      new Date(event.datetime) > today ? total + 1 : total + 0,
    0
  );
  const ticketsSold = events.reduce(
    (total, event) => total + event.ticketsPurchased,
    0
  );

  const topEvents = events
    .filter((event) => event.ticketsPurchased > 0)
    .sort((a, b) => (a.ticketsPurchased >= b.ticketsPurchased ? 1 : -1));

  return (
    <div className="w-full space-y-8">
      <div>
        <p className="py-3 px-2 text-2xl font-semibold">Analytics</p>
        <Separator />
        <Link
          href="/dashboard/events"
          className="flex justify-between py-5 px-2 hover:bg-slate-100"
        >
          <p>Upcoming Events</p>
          <p>{upcomingEvents}</p>
        </Link>
        <Separator />
        <Link
          href="/dashboard/analytics"
          className="flex justify-between py-5 px-2 hover:bg-slate-100"
        >
          <p>Tickets Sold</p>
          <p>{ticketsSold}</p>
        </Link>
        <Separator />
        <div className="flex justify-between py-5 px-2">
          <p>Events Hosted</p>
          <p>{events.length - upcomingEvents}</p>
        </div>
        <Separator />
      </div>
      <div>
        <p className="py-3 px-2 text-xl font-medium">Your top events</p>
        <Separator />
        {topEvents.length ? (
          <div className="space-y-5">
            {topEvents.map((event, index) => (
              <a
                key={event.eventId}
                href={`//app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/event/${event.eventId}`}
                className="flex justify-between py-5 px-2 hover:bg-slate-100"
                rel="noopener noreferrer"
                target="_blank"
              >
                <p>{event.title}</p>
                <p>#{index + 1}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-5 px-2">No statistics at the moment</div>
        )}
      </div>
    </div>
  );
}
