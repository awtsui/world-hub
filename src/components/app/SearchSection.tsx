'use client';

import { useState } from 'react';
import SearchPlacesCommand from './SearchPlacesCommand';
import { LatLng } from 'use-places-autocomplete';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/date-range-picker';
import SearchKeywordCommand from './SearchKeywordCommand';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import { useSearchDialog } from '@/context/ModalContext';

export default function SearchSection() {
  const { isSearchOpen, onSearchClose } = useSearchDialog();
  const [latLng, setLatLng] = useState<LatLng | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const searchDisabled = !(latLng || dateRange || keyword);

  function onClickSearch() {
    const params = new URLSearchParams();
    if (latLng) {
      params.set('lat', latLng.lat.toString());
      params.set('lng', latLng.lng.toString());
    }
    if (dateRange) {
      if (dateRange.from) {
        params.set('startDate', dateRange.from.toUTCString());
      }
      if (dateRange.to) {
        params.set('endDate', dateRange.to.toUTCString());
      }
    }
    if (keyword) {
      params.set('keyword', keyword);
    }
    if (isSearchOpen) {
      onSearchClose();
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex justify-center items-center gap-1 max-w-fit rounded-full border-2 h-[80px]">
      <SearchPlacesCommand setLatLng={setLatLng} />
      <Separator orientation="vertical" className="h-[60px]" />
      <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
      <Separator orientation="vertical" className="h-[60px]" />
      <SearchKeywordCommand setKeyword={setKeyword} onClickSearch={onClickSearch} searchDisabled={searchDisabled} />
    </div>
  );
}
