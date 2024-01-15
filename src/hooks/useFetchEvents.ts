'use client';

import { handleFetchError } from '@/lib/client/utils';
import { Event } from '@/lib/types';
import { useEffect, useState } from 'react';

interface useFetchEventsParams {
  eventIds?: string[];
}

export default function useFetchEvents({ eventIds }: useFetchEventsParams) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (eventIds && eventIds.length) {
      const eventsSearchUrl = `/api/events?${eventIds
        .map((id) => `id=${id}`)
        .join('&')}`;
      fetch(eventsSearchUrl)
        .then((resp) => resp.json())
        .then((data) => {
          setEvents(data);
        })
        .catch((error) => handleFetchError(error));
    }
  }, [JSON.stringify(eventIds)]);

  return { events };
}
