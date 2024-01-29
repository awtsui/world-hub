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
import { addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import useSWR from 'swr';
import { LatLng } from 'use-places-autocomplete';
import SearchPlacesCommand from './SearchPlacesCommand';
import { DatePickerWithRange } from '../ui/date-range-picker';
import SearchKeywordCommand from './SearchKeywordCommand';
import { Dialog, DialogContent } from '../ui/dialog';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import SearchSection from './SearchSection';

export default function SearchDialog() {
  const { isSearchOpen, onSearchClose } = useSearchDialog();
  // const router = useRouter();

  // const { data: events } = useSWR('/api/events', fetcher, { fallbackData: [] });
  // const { data: hostProfiles } = useSWR('/api/hosts/profile', fetcher, {
  //   fallbackData: [],
  // });

  // function handleOnSelectEvent(eventId: string) {
  //   router.push(`/event/${eventId}`);
  //   onSearchClose();
  // }

  // function handleOnSelectHost(hostId: string) {
  //   router.push(`/host/${hostId}`);
  //   onSearchClose();
  // }

  // return (
  //   <CommandDialog open={isSearchOpen} onOpenChange={onSearchClose} modal defaultOpen={isSearchOpen}>
  //     <CommandInput data-testid="search-dialog-input" placeholder="Search..." />
  //     <CommandList>
  //       <CommandEmpty>No results found.</CommandEmpty>
  //       <CommandGroup heading="Events">
  //         {events.length ? (
  //           events.map((event: any) => (
  //             <CommandItem key={event.eventId} onSelect={() => handleOnSelectEvent(event.eventId)} value={event.title}>
  //               {event.title}
  //             </CommandItem>
  //           ))
  //         ) : (
  //           <div>Loading...</div>
  //         )}
  //       </CommandGroup>
  //       <CommandGroup heading="Hosts">
  //         {hostProfiles.length ? (
  //           hostProfiles.map((profile: any) => (
  //             <CommandItem
  //               key={profile.hostId}
  //               onSelect={() => handleOnSelectHost(profile.hostId)}
  //               value={profile.name}
  //             >
  //               {profile.name}
  //             </CommandItem>
  //           ))
  //         ) : (
  //           <div>Loading...</div>
  //         )}
  //       </CommandGroup>
  //       <CommandSeparator />
  //     </CommandList>
  //   </CommandDialog>
  // );

  const [place, setPlace] = useState('');
  const [latLng, setLatLng] = useState<LatLng | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  const [keyword, setKeyword] = useState('');

  function handleSearchOnClick() {
    onSearchClose();
  }

  return (
    <Dialog open={isSearchOpen} onOpenChange={onSearchClose} modal defaultOpen={isSearchOpen}>
      <DialogContent className="flex gap-2 max-w-fit items-end">
        <SearchSection />
      </DialogContent>
    </Dialog>
  );
}
