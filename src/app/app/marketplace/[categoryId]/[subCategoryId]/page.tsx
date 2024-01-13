import { categoryIdToName, subCategoryIdToName } from '@/lib/data';
import EventCard from '@/components/app/EventCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';
import { getEventsBySubCategory } from '@/lib/utils';

type SubCategoryPageParams = {
  params: {
    categoryId: string;
    subCategoryId: string;
  };
};

export default async function SubCategoryPage({
  params,
}: SubCategoryPageParams) {
  // TODO: Organize events based on subcategory
  // Replace with data fetching
  const categoryName = categoryIdToName[params.categoryId];
  const subCategoryName = subCategoryIdToName[params.subCategoryId];

  const events: Event[] = await getEventsBySubCategory(subCategoryName);

  return (
    <div className="px-12 py-4">
      <div className="flex items-center">
        <Link href={`/marketplace/${params.categoryId}`} className="text-3xl">
          {categoryName}
        </Link>
        <ChevronRight />
        <p className="text-4xl">{subCategoryName}</p>
      </div>
      <div className="h-80 text-center">Image</div>
      {events ? (
        <div className="flex flex-wrap gap-3">
          {events.length > 0 ? (
            events.map((event) => (
              <Link href={`/event/${event.eventId}`}>
                <EventCard key={event.eventId} event={event}></EventCard>
              </Link>
            ))
          ) : (
            <div>No Events</div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}