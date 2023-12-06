import { categoryIdToName } from '@/data/marketplace';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Event } from '@/types';

type CategoryPageParams = {
  params: {
    categoryId: string;
  };
};

async function getEventsByCategory(categoryName: string) {
  try {
    const baseUrl = process.env.BASE_URL;
    const resp = await fetch(`${baseUrl}/api/events?category=${categoryName}`, {
      next: { revalidate: 3600 },
    });
    return resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events by category: ${error}`);
  }
}

export default async function CategoryPage({ params }: CategoryPageParams) {
  // TODO: Organize events based on subcategory
  // Replace with data fetching
  const categoryName = categoryIdToName[params.categoryId];

  const events: Event[] = await getEventsByCategory(categoryName);

  return (
    <div className="px-12 py-4">
      <div className="flex items-center">
        <Link href="/marketplace" className="text-3xl">
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
              <EventCard key={event.eventId} {...event}></EventCard>
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
