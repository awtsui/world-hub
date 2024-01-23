import { MainCategory, SubCategory, Event } from '@/lib/types';
import Link from 'next/link';
import EventsCarousel from '@/components/EventsCarousel';

interface CategorySectionProps {
  category: MainCategory;
  subCategory?: SubCategory;
  events: Event[];
}

export default function CategorySection({ category, subCategory, events }: CategorySectionProps) {
  const isCategory = !subCategory;

  const filteredEvents = events.filter((event) => {
    if (isCategory) {
      return event.category === category.name;
    } else {
      return event.subCategory === subCategory.name;
    }
  });

  return (
    <div className="flex flex-col">
      {filteredEvents.length > 0 && (
        <div className="px-5 py-3">
          <Link
            className="text-2xl font-bold pl-3"
            href={`/marketplace/${category.id}${!isCategory ? `/${subCategory.id}` : ''}`}
          >
            {isCategory ? category.name : subCategory.name}
          </Link>
          <div className="pt-2">
            <EventsCarousel events={filteredEvents} />
          </div>
        </div>
      )}
    </div>
  );
}
