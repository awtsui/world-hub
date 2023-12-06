import { Event } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

type EventCardProps = Event;

export default function EventCard({
  eventId,
  eventName,
  thumbnailUrl,
  subCategory,
}: EventCardProps) {
  return (
    <div className="flex-shrink-0 snap-center">
      <Link href={`/event/${eventId}`}>
        <Image
          src={thumbnailUrl}
          alt={eventName}
          width={300}
          height={200}
          className="object-cover"
        />
      </Link>

      <div className="flex flex-col">
        <p>{eventName}</p>
        <p>{subCategory}</p>
      </div>
    </div>
  );
}
