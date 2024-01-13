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
import { Event } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchDialog() {
  const { isSearchOpen, onSearchClose } = useSearchDialog();
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/events')
      .then((resp) => resp.json())
      .then((data) => setEvents(data));
  }, []);

  function handleOnSelect(eventId: string) {
    router.push(`/event/${eventId}`);
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
          {events.length &&
            events.map((event) => (
              <CommandItem
                key={event.eventId}
                onSelect={() => handleOnSelect(event.eventId)}
                value={event.title}
              >
                {event.title}
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
}
