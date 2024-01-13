import { MainCategory, SubCategory, Event } from '@/lib/types';
import EventCard from './EventCard';
import Link from 'next/link';
import EventsCarousel from '../EventsCarousel';

type CategorySectionProps = {
  category: MainCategory;
  subCategory?: SubCategory;
  events: Event[] | null;
};

export default function CategorySection({
  category,
  subCategory,
  events,
}: CategorySectionProps) {
  if (!events) return null;

  const filteredEvents = events.filter((event) => {
    if (subCategory) {
      return event.subCategory === subCategory.name;
    } else {
      return event.category === category.name;
    }
  });

  return (
    <div className="flex flex-col">
      {filteredEvents.length > 0 && (
        <div className="pb-8">
          <Link
            className="text-xl font-medium"
            href={`/marketplace/${category.id}`}
          >
            {category.name}
          </Link>
          <div className="px-5 py-5">
            <EventsCarousel events={filteredEvents} />
          </div>
        </div>
      )}
    </div>
  );
}
