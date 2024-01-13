import CategoryDropdown from '@/components/CategoryDropdown';
import { categories } from '@/data/marketplace';
import CategorySection from '../../../components/CategorySection';
import { Event } from '@/types';
import { getAllEvents } from '@/utils/client-helper';

export default async function MarketplaceHomePage() {
  const events: Event[] = await getAllEvents();

  return (
    <div className="flex flex-col px-12 py-4">
      <div className="h-80 text-center">Image</div>
      <div className="flex flex-col">
        <p>Popular</p>
      </div>
    </div>
  );
}
