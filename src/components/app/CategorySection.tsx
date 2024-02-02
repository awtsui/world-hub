import { MainCategory, SubCategory, Event } from '@/lib/types';
import Link from 'next/link';
import EventsCarousel from '@/components/EventsCarousel';
import { getTrendingEventsByCategory, getTrendingEventsBySubcategory } from '@/lib/actions';
import { config } from '@/lib/config';

interface CategorySectionProps {
  category: MainCategory;
  subCategory?: SubCategory;
}

export default async function CategorySection({ category, subCategory }: CategorySectionProps) {
  const isCategory = !subCategory;

  let events;
  if (isCategory) {
    events = await getTrendingEventsByCategory(category.name, config.TRENDING_EVENTS_BY_CATEGORY_LIMIT);
  } else {
    events = await getTrendingEventsBySubcategory(subCategory.name, config.TRENDING_EVENTS_BY_SUBCATEGORY_LIMIT);
  }

  events.sort((a, b) => (new Date(a.datetime) < new Date(b.datetime) ? -1 : 1));

  return (
    <div className="flex flex-col">
      {events.length > 0 && (
        <div className="px-5 py-3">
          <Link
            className="text-2xl font-bold pl-3"
            href={`/marketplace/${category.id}${!isCategory ? `/${subCategory.id}` : ''}`}
          >
            {isCategory ? category.name : subCategory.name}
          </Link>
          <div className="pt-2">
            <EventsCarousel events={events} />
          </div>
        </div>
      )}
    </div>
  );
}
