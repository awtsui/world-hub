import { categoryIdToName, subCategoryIdToName } from '@/data/marketplace';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Event } from '@/types';
import { getEventsBySubCategory } from '@/utils/client-helper';

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
              <EventCard key={event.eventId} event={event}></EventCard>
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
