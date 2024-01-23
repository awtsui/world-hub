import { categories } from '@/lib/data';
import CategorySection from '@/components/app/CategorySection';
import { Event } from '@/lib/types';
import { getApprovedEvents } from '@/lib/actions';
import TrendingEventsSection from '@/components/app/TrendingEventsSection';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

export default async function MarketplaceHomePage() {
  const events: Event[] = await getApprovedEvents();
  // TODO: populate page with all events
  if (!events) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col">
      <AspectRatio ratio={3 / 1}>
        <Image src="/homebg2.png" alt="home-bg" fill className="object-cover" />
      </AspectRatio>
      <div className="flex flex-col py-4 px-12">
        <TrendingEventsSection events={events} />
        {Object.values(categories).map((category) => (
          <CategorySection key={category.id} category={category} events={events} />
        ))}
      </div>
    </div>
  );
}
