import { MainCategory, SubCategory, Event } from '@/lib/types';
import Link from 'next/link';
import EventsCarousel from '../EventsCarousel';

type CategorySectionProps = {
  category: MainCategory;
  subCategory?: SubCategory;
  events: Event[];
};

export default function CategorySection({
  category,
  subCategory,
  events,
}: CategorySectionProps) {
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
            className="text-3xl font-medium"
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
