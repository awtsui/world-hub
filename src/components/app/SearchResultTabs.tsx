'use client';

import { SearchResult } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import EventViewRow from './EventViewRow';
import VenueViewRow from './VenueViewRow';
import HostViewRow from './HostViewRow';

interface SearchResultTabsProps {
  searchResults: SearchResult;
}

export default function SearchResultTabs({ searchResults }: SearchResultTabsProps) {
  const events = searchResults.events;
  const venues = searchResults.venues;
  const hostProfiles = searchResults.hostProfiles;
  return (
    <Tabs defaultValue="events" className="flex flex-col items-center w-full">
      <TabsList className="h-12 w-1/2">
        <TabsTrigger value="events" className="w-full h-full">
          Events
        </TabsTrigger>
        <TabsTrigger value="venues" className="w-full h-full">
          Venues
        </TabsTrigger>
        <TabsTrigger value="hosts" className="w-full h-full">
          Hosts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="events" className="w-full">
        <div className="space-y-5 px-5">
          <div className="flex gap-3 items-center pt-5">
            <p className="text-3xl font-semibold">Events</p>
            <p className="text-3xl font-light">
              {events.length} result{events.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex flex-col">
            {events.map((event) => (
              <EventViewRow event={event} />
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="venues" className="w-full">
        <div className="space-y-5 px-5">
          <div className="flex gap-3 items-center pt-5">
            <p className="text-3xl font-semibold">Venues</p>
            <p className="text-3xl font-light">
              {venues.length} result{venues.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex flex-col">
            {venues.map((venue) => (
              <VenueViewRow venue={venue} />
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="hosts" className="w-full">
        <div className="space-y-5 px-5">
          <div className="flex gap-3 items-center pt-5">
            <p className="text-3xl font-semibold">Hosts</p>
            <p className="text-3xl font-light">
              {hostProfiles.length} result{hostProfiles.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex flex-col">
            {hostProfiles.map((hostProfile) => (
              <HostViewRow hostProfile={hostProfile} />
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
