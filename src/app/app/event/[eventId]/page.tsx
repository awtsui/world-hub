import DateFormatter from '@/components/DateFormatter';
import ReturnButton from '@/components/ReturnButton';
import AddTicketButton from '@/components/AddTicketButton';
import { Event, Host, Tier } from '@/types';
import { getEventsByIds, getHostById } from '@/utils/client-helper';

type EventPageParams = {
  params: {
    eventId: string;
  };
};

export default async function EventPage({ params }: EventPageParams) {
  // Replace with data fetching
  const event: Event = (await getEventsByIds([params.eventId]))[0];
  const host: Host = await getHostById(event.hostId);

  return (
    <div className="px-12 py-4">
      <ReturnButton />
      {event ? (
        <div className="p-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <p className="mb-2">
              <strong>Artist: {host.name}</strong>
            </p>
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
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
