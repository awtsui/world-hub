import { Category, Event } from '@/types';
import EventCard from './EventCard';

type CategorySectionProps = {
  category: Category;
  events: Event[] | null;
};

export default function CategorySection({
  category,
  events,
}: CategorySectionProps) {
  if (!events) return null;

  const filteredEvents = events.filter(
    (event) => event.category == category.name
  );

  return (
    <div className="flex flex-col">
      {filteredEvents.length > 0 && (
        <div className="pb-8">
          <a className="text-xl" href={`/marketplace/category/${category.id}`}>
            {category.name}
          </a>
          <div className="flex overflow-x-auto whitespace-nowrap scroll-smooth snap-x gap-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.eventId} {...event}></EventCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
