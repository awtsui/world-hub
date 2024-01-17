import { categories } from '@/lib/data';
import CategorySection from '../../../components/app/CategorySection';
import { Event } from '@/lib/types';
import { getApprovedEvents } from '@/lib/actions';
import PopularEventsSection from '@/components/app/PopularEventsSection';

export default async function MarketplaceHomePage() {
  const events: Event[] = await getApprovedEvents();
  // TODO: populate page with all events
  if (!events) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col px-12 py-4">
      <div className="h-80 text-center">Image</div>
      <div className="flex flex-col">
        <p className="text-3xl">Popular</p>
        <PopularEventsSection events={events} />
        {Object.values(categories).map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            events={events}
          />
        ))}
      </div>
    </div>
  );
}
