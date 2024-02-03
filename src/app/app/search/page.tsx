'use client';

import SearchResultTabs from '@/components/app/SearchResultTabs';
import { fetcher } from '@/lib/client/utils';
import { SearchResult } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

export default function SearchPage() {
  const searchParams = useSearchParams();

  const { data: searchResults } = useSWR<SearchResult>(`/api/search?${searchParams.toString()}`, fetcher, {
    fallbackData: { events: [], venues: [], hostProfiles: [] },
  });

  const tab = searchParams.get('tab');

  if (!searchResults) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20">
      <div className="w-4/5">
        <SearchResultTabs searchResults={searchResults} tab={tab} />
      </div>
    </div>
  );
}
