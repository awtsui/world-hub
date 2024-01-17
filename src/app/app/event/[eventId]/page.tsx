import {
  getEventsByIds,
  getHostProfileById,
  getVenueById,
} from '@/lib/actions';
import Image from 'next/image';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/client/utils';
import GoogleMapView from '@/components/app/GoogleMapView';
import CopyToClipboard from '@/components/CopyToClipboard';
import { Button } from '@/components/ui/button';
import AddTicketDialog from '@/components/app/AddTicketDialog';

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

  if (!event || !host || !venue) {
    return <div>Loading...</div>;
  }

  const venueAddress = `${venue.address} ${venue.city}, ${venue.state} ${venue.zipcode}`;
  const [date, time] = formatDate(new Date(event.datetime)).split(' at ');

  return (
    <div className="mx-auto w-3/5">
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src={event.thumbnailUrl}
          alt={event.eventId}
          fill
          style={{ objectFit: 'cover', borderRadius: '20px' }}
          className="rounded-lg"
        />
        <div className="absolute z-20 bottom-0 left-0 right-0 px-12 py-6 rounded-b-lg">
          <p className="text-white text-3xl font-extrabold ">{host.name}</p>
        </div>
      </div>
      <div className="flex pt-6 px-12 justify-center gap-5 md:gap-20 lg:gap-36">
        <div className="flex flex-col w-auto">
          <div className="pb-4">
            <p className="text-3xl font-extrabold">
              {event.title}: {event.subTitle}
            </p>
            <p className="text-lg">{event.subCategory}</p>
          </div>
          <p className="py-4">{event.description}</p>
          <div className="flex flex-col gap-2 py-4">
            <div className="flex gap-3 items-center">
              <MapPin />
              <CopyToClipboard text={venueAddress}>
                <p className="text-md hover:text-blue-600">
                  {venue.name} {venue.city}, {venue.state}
                </p>
              </CopyToClipboard>
            </div>
            <div className="flex gap-3 items-center">
              <Calendar />
              <p className="text-md">{date}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Clock />
              <p className="text-md">{time}</p>
            </div>
          </div>
          <div className="py-4">
            <AddTicketDialog event={event} />
          </div>
        </div>
        <div className="flex flex-col w-auto">
          <p className="text-xl font-bold">Event location</p>
          <div className="pt-4">
            <GoogleMapView address={venueAddress} />
          </div>
          <div className="pt-5">
            <p className="text-xl font-bold">Parking</p>
            <p>{venue.parking}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
