import { Event } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

type EventCardProps = { event: Event };

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="flex-shrink-0 snap-center">
      <Link href={`/event/${event.eventId}`}>
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          width={300}
          height={200}
          className="object-cover"
        />
      </Link>

      <div className="flex flex-col">
        <p>{event.title}</p>
        <p>{event.subCategory}</p>
      </div>
    </div>
  );
}
