import CategoryDropdown from '@/components/CategoryDropdown';
import { categories } from '@/data/marketplace';
import CategorySection from '../../components/CategorySection';
import { Event } from '@/types';

async function getEvents() {
  try {
    const baseUrl = process.env.BASE_URL;
    const resp = await fetch(`${baseUrl}/api/events`, {
      next: { revalidate: 3600 },
    });
    return resp.json();
  } catch (error) {
    throw new Error(`Unable to fetch events: ${error}`);
  }
}

export default async function MarketplacePage() {
  const events: Event[] = await getEvents();

  return (
    <div className="flex flex-col px-12 py-4">
      <div className="flex gap-4 items-center">
        <text className="text-3xl">Marketplace</text>

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
