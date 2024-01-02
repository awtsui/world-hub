import CategoryDropdown from '@/components/CategoryDropdown';
import { categories } from '@/data/marketplace';
import CategorySection from '../../components/CategorySection';
import { Event } from '@/types';
import { getAllEvents } from '@/utils/client-helper';

export default async function MarketplacePage() {
  const events: Event[] = await getAllEvents();

  return (
    <div className="flex flex-col px-12 py-4">
      <div className="flex gap-4 items-center">
        <p className="text-3xl">Marketplace</p>

        <CategoryDropdown categories={categories} />
      </div>
      <div className="h-80 text-center">Image</div>
      <div className="flex flex-col">
        {events &&
          categories.map((category) => (
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
