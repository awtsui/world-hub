'use client';

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog,
  CommandSeparator,
} from '@/components/ui/command';
import { useSearchDialog } from '@/context/ModalContext';
import { fetcher } from '@/lib/client/utils';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

export default function SearchDialog() {
  const { isSearchOpen, onSearchClose } = useSearchDialog();
  const router = useRouter();

  const { data: events } = useSWR('/api/events', fetcher, { fallbackData: [] });
  const { data: hostProfiles } = useSWR('/api/hosts/profile', fetcher, {
    fallbackData: [],
  });

  function handleOnSelectEvent(eventId: string) {
    router.push(`/event/${eventId}`);
    onSearchClose();
  }

  function handleOnSelectHost(hostId: string) {
    router.push(`/host/${hostId}`);
    onSearchClose();
  }

  return (
    <CommandDialog
      open={isSearchOpen}
      onOpenChange={onSearchClose}
      modal
      defaultOpen={isSearchOpen}
    >
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Events">
          {events.length ? (
            events.map((event: any) => (
              <CommandItem
                key={event.eventId}
                onSelect={() => handleOnSelectEvent(event.eventId)}
                value={event.title}
              >
                {event.title}
              </CommandItem>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </CommandGroup>
        <CommandGroup heading="Hosts">
          {hostProfiles.length ? (
            hostProfiles.map((profile: any) => (
              <CommandItem
                key={profile.hostId}
                onSelect={() => handleOnSelectHost(profile.hostId)}
                value={profile.name}
              >
                {profile.name}
              </CommandItem>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
}
