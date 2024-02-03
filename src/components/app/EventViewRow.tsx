'use client';
import {
  fetcher,
  formatDate,
  formatDayNumeric,
  formatMonthShort,
  formatTime,
  formatWeekdayLong,
} from '@/lib/client/utils';
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
      <div className="flex items-center gap-4 px-4">
        <div className="flex flex-col items-center w-20">
          <p>{formatMonthShort(event.datetime)}</p>
          <p className="text-2xl">{formatDayNumeric(event.datetime)}</p>
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-slate-500 whitespace-nowrap">
            {formatWeekdayLong(event.datetime)} &#x2022; {formatTime(event.datetime)}
          </p>
          <p className="font-semibold text-lg whitespace-nowrap">{event.title}</p>
          {venue ? (
            <p className="text-slate-500 whitespace-nowrap">
              {venue.name} &#x2022; {venue.city}, {venue.state}
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
