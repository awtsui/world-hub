'use client';
import { fetcher, formatDate } from '@/lib/client/utils';
import { Event } from '@/lib/types';
import useSWR from 'swr';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EventViewRowProps {
  event: Event;
}

export default function EventViewRow({ event }: EventViewRowProps) {
  const { data: venue } = useSWR(`/api/venues?id=${event.venueId}`, fetcher);
  const router = useRouter();

  const formattedDate = formatDate(event.datetime);
  const [date, time] = formattedDate.split(' at ');
  const [weekday, monthAndDay, _] = date.split(', ');

  const [month, day] = monthAndDay.split(' ');

  function onClick() {
    router.push(`/event/${event.eventId}`);
  }

  return (
    <div className="space-y-3 pt-3">
      <div className="flex items-center gap-10 px-4">
        <div className="flex flex-col items-center">
          <p>{month}</p>
          <p className="text-2xl">{day}</p>
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-slate-500 whitespace-nowrap">
            {weekday} - {time}
          </p>
          <p className="font-semibold whitespace-nowrap">{event.title}</p>
          {venue ? (
            <p className="text-slate-500 whitespace-nowrap">
              {venue.city}, {venue.state} - {venue.name}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <Button className="flex items-center" onClick={onClick}>
          <p>Find tickets</p>
          <ChevronRight className="w-5 h-5 ml-4" />
        </Button>
      </div>
      <hr />
    </div>
  );
}
