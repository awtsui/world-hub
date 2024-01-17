'use client';

import CreateEventButton from '@/components/hosts/CreateEventButton';
import EventViewCard from '@/components/hosts/EventViewCard';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetcher } from '@/lib/client/utils';
import { Event } from '@/lib/types';

export default function HostDashboardEventsPage() {
  const { data: session } = useSession();

  const { data: profileData, isLoading } = useSWR(
    session?.user?.id ? `/api/hosts/profile?id=${session.user.id}` : '',
    fetcher
  );

  const fetchEventsUrl =
    profileData && profileData.events.length
      ? `/api/events?${profileData.events
          .map((eventId: any) => `id=${eventId}`)
          .join('&')}`
      : '';

  const { data: events } = useSWR(fetchEventsUrl, fetcher, {
    fallbackData: [],
  });

  let upcomingEvents: Event[] = [];
  let pastEvents: Event[] = [];

  const now = new Date();
  events.forEach((event: Event) => {
    const eventDatetime = new Date(event.datetime);
    if (eventDatetime >= now) {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  });

  return (
    <div className="px-12 py-4">
      <div className="flex justify-between">
        <p className="text-3xl">My Events</p>
        <CreateEventButton />
      </div>
      <div className="py-5">
        <p className="text-2xl">Upcoming Events</p>
        <div className="flex flex-wrap gap-5 pt-8">
          {upcomingEvents.map((upcomingEvent: any) => (
            <EventViewCard key={upcomingEvent.eventId} event={upcomingEvent} />
          ))}
        </div>
      </div>
      <div className="py-5">
        <p className="text-2xl">Past Events</p>
        <div className="flex flex-wrap gap-5 pt-8">
          {pastEvents.map((pastEvent: any) => (
            <EventViewCard key={pastEvent.eventId} event={pastEvent} />
          ))}
        </div>
      </div>
    </div>
  );
}
