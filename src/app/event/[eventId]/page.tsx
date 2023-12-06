import DateFormatter from '@/components/DateFormatter';
import ReturnButton from '@/components/ReturnButton';
import TicketButton from '@/components/TicketButton';

type EventPageParams = {
  params: {
    eventId: string;
  };
};

async function getEvent(eventId: string) {
  try {
    const baseUrl = process.env.BASE_URL;
    const resp = await fetch(`${baseUrl}/api/events/${eventId}`, {
      next: { revalidate: 3600 },
    });
    return resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch event by id: ${error}`);
  }
}

export default async function EventPage({ params }: EventPageParams) {
  // Replace with data fetching
  const event = await getEvent(params.eventId);

  return (
    <div className="px-12 py-4">
      <ReturnButton />
      {event ? (
        <div className="p-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">{event.eventName}</h1>

            <p className="mb-2">
              <strong>{event.profileId}(Artist)</strong>
            </p>
            <p className="mb-2">
              <DateFormatter date={new Date(event.eventDatetime)} />
            </p>
            <p className="mb-2">Price: ${event.price}</p>
            <p className="mb-2">{event.description}</p>
            <TicketButton event={event} />
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
