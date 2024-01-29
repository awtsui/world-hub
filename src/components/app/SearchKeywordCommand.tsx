'use client';

import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import { fetcher } from '@/lib/client/utils';
import useSWR from 'swr';
import { cn } from '@/lib/utils';
import { Event, HostProfile, Venue } from '@/lib/types';

type Result = {
  resultType: string;
  value: string;
  id: string;
};

interface SearchKeywordCommandProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onClickSearch: () => void;
  searchDisabled: boolean;
}

export default function SearchKeywordCommand({
  keyword,
  setKeyword,
  onClickSearch,
  searchDisabled,
}: SearchKeywordCommandProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isKeywordHovered, setIsKeywordHovered] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputDivRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // TODO: build custom search hooks for each
  const { data: events } = useSWR<Event[]>('/api/events', fetcher, { fallbackData: [] });
  const { data: hostProfiles } = useSWR<HostProfile[]>('/api/hosts/profile', fetcher, {
    fallbackData: [],
  });
  const { data: venues } = useSWR<Venue[]>('/api/venues', fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    }
    function handleClickInside(event: any) {
      event.preventDefault();
      if (inputDivRef.current && inputRef.current && inputDivRef.current.contains(event.target)) {
        inputRef.current.focus();
        setIsSearching(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickInside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickInside);
    };
  }, []);

  useEffect(() => {
    if (keyword && isSearching) {
      const tempResults: Result[] = [];
      if (events) {
        tempResults.push(
          ...events
            .filter((event: Event) => event.title.toLowerCase().includes(keyword.toLowerCase()))
            .map((event) => ({ resultType: 'Event', value: event.title, id: event.eventId })),
        );
      }
      if (venues) {
        tempResults.push(
          ...venues
            .filter((venue: Venue) => venue.name.toLowerCase().includes(keyword.toLowerCase()))
            .map((venue) => ({ resultType: 'Venue', value: venue.name, id: venue.venueId })),
        );
      }
      if (hostProfiles) {
        tempResults.push(
          ...hostProfiles
            .filter((profile: HostProfile) => profile.name.toLowerCase().includes(keyword.toLowerCase()))
            .map((profile) => ({ resultType: 'Host', value: profile.name, id: profile.hostId })),
        );
      }
      setResults(tempResults);
    } else {
      setResults([]);
    }
  }, [keyword]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setKeyword(event.target.value);
    setIsSearching(true);
  }

  function handleOnClick(keyword: string) {
    setKeyword(keyword);
    setIsSearching(false);
    setResults([]);
  }

  function handleMouseEnterSearch(event: MouseEvent<HTMLButtonElement>) {
    setIsSearchHovered(true);
  }

  const eventResults = results.filter((result) => result.resultType === 'Event');
  const venueResults = results.filter((result) => result.resultType === 'Venue');
  const hostProfileResults = results.filter((result) => result.resultType === 'Host');

  // TODO: May help to use debounce hook when filtering events, hosts, and venues

  return (
    <div className="h-full">
      <div
        className={cn(
          'h-full flex items-center rounded-r-full pr-3 cursor-pointer',
          isKeywordHovered && !isSearchHovered ? 'bg-accent text-accent-foreground' : '',
        )}
        onMouseEnter={() => setIsKeywordHovered(true)}
        onMouseLeave={() => setIsKeywordHovered(false)}
        ref={inputDivRef}
      >
        <div className="flex flex-col items-start justify-center w-[300px]">
          <p className="text-sm ml-3">Who</p>
          <input
            type="text"
            placeholder="Search for event, host, or venue"
            className={cn(
              'border-none w-full text-md text-slate-500 h-6 py-0 placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-0',
              isKeywordHovered && !isSearchHovered ? 'bg-accent text-accent-foreground' : '',
            )}
            value={keyword}
            onChange={handleInputChange}
            ref={inputRef}
          />
        </div>

        <Button
          className="z-10 rounded-full h-14 w-14"
          onClick={onClickSearch}
          onMouseEnter={handleMouseEnterSearch}
          onMouseLeave={() => setIsSearchHovered(false)}
          disabled={searchDisabled}
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
      {isSearching && results.length ? (
        <div ref={dropdownRef} className="bg-white w-full py-1 mt-1 border-2 rounded-md relative z-50">
          {[eventResults, hostProfileResults, venueResults].map((results, index) => (
            <div key={`result-${index}`}>
              {results.length ? (
                <>
                  {index > 0 && <hr className="pb-1" />}
                  <p className="text-sm text-slate-500 ml-2">{results[0].resultType}</p>
                  <ol>
                    {results.map((result) => (
                      <li key={result.id}>
                        <Button
                          variant="ghost"
                          onClick={() => handleOnClick(result.value)}
                          className="justify-start w-full text-md h-8"
                        >
                          {result.value}
                        </Button>
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
