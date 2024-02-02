'use client';

import SearchResultTabs from '@/components/app/SearchResultTabs';
import { fetcher } from '@/lib/client/utils';
import { SearchResult } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import useSWRImmutable from 'swr/immutable';

export default function SearchPage() {
  const searchParams = useSearchParams();

  const { data: searchResults } = useSWRImmutable<SearchResult>(`/api/search?${searchParams.toString()}`, fetcher);

  if (!searchResults) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20">
      <div className="w-4/5">
        <SearchResultTabs searchResults={searchResults} />
      </div>
    </div>
  );
}
