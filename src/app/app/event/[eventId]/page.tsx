import DateFormatter from '@/components/DateFormatter';
import ReturnButton from '@/components/ReturnButton';
import AddTicketButton from '@/components/app/AddTicketButton';
import { Event, HostProfile, Tier } from '@/lib/types';
import {
  getEventsByIds,
  getHostProfileById,
  getVenueById,
} from '@/lib/actions';
import Image from 'next/image';

type EventPageParams = {
  params: {
    eventId: string;
  };
};

export default async function EventPage({ params }: EventPageParams) {
  // Replace with data fetching
  const event = (await getEventsByIds([params.eventId]))[0];
  const host = await getHostProfileById(event.hostId);
  const venue = await getVenueById(event.venueId);

  return (
    <div className="px-12 py-4">
      <ReturnButton />
      <div className="p-4">
        {event && (
          <div className="flex flex-col items-center">
            <Image
              src={event.thumbnailUrl}
              alt={event.title}
              width={300}
              height={300}
            />
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            {host && (
              <p className="mb-2">
                <strong>{host.name}</strong>
              </p>
            )}
            {venue && (
              <p>
                {venue.city}, {venue.state} - {venue.name}
              </p>
            )}
            <p className="mb-2">
              <DateFormatter date={new Date(event.datetime)} />
            </p>
            <p className="mb-2">{event.description}</p>
            <p className="mb-2">
              {event.category} {'>'} {event.subCategory}
            </p>
            {event.ticketTiers.map((tier: Tier) => (
              <div key={tier.label} className="flex">
                <p className="mb-2">Tier: {tier.label}</p>
                <p className="mb-2">Price: ${tier.price}</p>
                <AddTicketButton event={event} tier={tier} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
