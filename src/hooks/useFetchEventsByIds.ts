import { fetcher } from '@/lib/client/utils';
import { Event } from '@/lib/types';
import useSWR from 'swr';

export default function useFetchEventsByIds(eventIds?: string[]) {
  const eventsSearchUrl =
    eventIds && eventIds.length ? `/api/events?${eventIds.map((id) => `id=${id}`).join('&')}` : '';

  const { data: events } = useSWR<Event[]>(eventsSearchUrl, fetcher, {
    fallbackData: [],
  });

  return events;
}
