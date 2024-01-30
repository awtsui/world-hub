import { handleFetchError } from '@/lib/client/utils';
import { Event, HostProfile, KeywordSearchResult, Venue } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from './useDebounce';

export default function useSearchWithKeyword() {
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [hostProfiles, setHostProfiles] = useState<HostProfile[]>([]);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<KeywordSearchResult[]>([]);

  useDebounce(
    () => {
      const trimmedKeyword = value.trim();
      if (trimmedKeyword) {
        fetch(`/api/events?keyword=${trimmedKeyword}`)
          .then((resp) => resp.json())
          .then((data) => setEvents(data))
          .catch((error) => handleFetchError(error));
        fetch(`/api/venues?keyword=${trimmedKeyword}`)
          .then((resp) => resp.json())
          .then((data) => setVenues(data))
          .catch((error) => handleFetchError(error));
        fetch(`/api/hosts/profile?keyword=${trimmedKeyword}`)
          .then((resp) => resp.json())
          .then((data) => setHostProfiles(data))
          .catch((error) => handleFetchError(error));
      } else {
        setResults([]);
      }
    },
    [value],
    300,
  );

  useEffect(() => {
    const tempResults: KeywordSearchResult[] = [];
    if (events) {
      tempResults.push(...events.map((event) => ({ resultType: 'Event', value: event.title, id: event.eventId })));
    }
    if (venues) {
      tempResults.push(...venues.map((venue) => ({ resultType: 'Venue', value: venue.name, id: venue.venueId })));
    }
    if (hostProfiles) {
      tempResults.push(
        ...hostProfiles.map((profile) => ({ resultType: 'Host', value: profile.name, id: profile.hostId })),
      );
    }
    setResults(tempResults);
  }, [JSON.stringify(events), JSON.stringify(venues), JSON.stringify(hostProfiles)]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, [setResults]);

  return { results, value, setValue, clearResults };
}
