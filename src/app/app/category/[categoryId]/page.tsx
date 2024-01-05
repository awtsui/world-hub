import { categoryIdToName } from '@/data/marketplace';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Event } from '@/types';
import { getEventsByCategory } from '@/utils/client-helper';

type CategoryPageParams = {
  params: {
    categoryId: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageParams) {
  // TODO: Organize events based on subcategory
  // Replace with data fetching
  const categoryName = categoryIdToName[params.categoryId];

  const events: Event[] = await getEventsByCategory(categoryName);

  return (
    <div className="px-12 py-4">
      <div className="flex items-center">
        <Link href="/" className="text-3xl">
          Marketplace
        </Link>
        <ChevronRight />
        {categoryName}
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
