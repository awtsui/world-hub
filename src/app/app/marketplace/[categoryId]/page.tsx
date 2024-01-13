import { categoryIdToName } from '@/lib/data';
import EventCard from '@/components/app/EventCard';
import { Event } from '@/lib/types';
import CategoryDropdown from '@/components/app/CategoryDropdown';
import { getEventsByCategory } from '@/lib/utils';
import Link from 'next/link';

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
      <div className="flex items-center gap-10">
        <p className="text-3xl">{categoryName}</p>
        <CategoryDropdown categoryId={params.categoryId} />
      </div>
      <div className="h-80 text-center">Image</div>
      {events ? (
        <div className="flex flex-wrap gap-3">
          {events.length ? (
            events.map((event) => (
              <Link key={event.eventId} href={`/event/${event.eventId}`}>
                <EventCard key={event.eventId} event={event} />
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
