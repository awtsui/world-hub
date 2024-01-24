import CreateEventButton from '@/components/hosts/CreateEventButton';
import EventViewCard from '@/components/hosts/EventViewCard';
import { Event } from '@/lib/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth/utils/options';
import { getEventsByIds, getHostProfileById } from '@/lib/actions';

export default async function HostDashboardEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null;
  }

  const hostProfile = await getHostProfileById(session.user.id);

  const events = await getEventsByIds(hostProfile.events);

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
