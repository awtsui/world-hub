import CopyToClipboard from '@/components/CopyToClipboard';
import EventViewRow from '@/components/app/EventViewRow';
import GoogleMapView from '@/components/app/GoogleMapView';
import { getApprovedEventsByVenueId, getVenueById } from '@/lib/actions';

interface VenuePageParams {
  params: {
    venueId: string;
  };
}

export default async function VenuePage({ params }: VenuePageParams) {
  const venue = await getVenueById(params.venueId);
  const events = await getApprovedEventsByVenueId(params.venueId);

  const venueAddress = `${venue.address} ${venue.city}, ${venue.state} ${venue.zipcode}`;

  return (
    <div className="py-12">
      <div className="flex justify-center items-start gap-12">
        <div className="flex flex-col gap-8 w-1/2">
          <p className="text-5xl font-bold whitespace-nowrap">{venue.name}</p>
          <div>
            <p className="text-xl font-bold py-2">Events</p>
            <div>
              {events.length ? (
                events.map((event) => <EventViewRow key={event.eventId} event={event} />)
              ) : (
                <p>No events</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-20">
          <div>
            <p className="text-xl font-bold py-2">Address</p>
            <CopyToClipboard text={venueAddress}>
              <p className="hover:text-green-500">{venueAddress}</p>
            </CopyToClipboard>
          </div>
          <div>
            <p className="text-xl font-bold py-2">Map</p>
            <div className="py-2">
              <GoogleMapView address={venueAddress} />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold py-2">Parking</p>
            <div>
              {venue.parking.map((instruction: string, index: number) => (
                <p key={index}>{instruction}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
