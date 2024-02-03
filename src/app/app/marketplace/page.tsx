import { categories } from '@/lib/data';
import CategorySection from '@/components/app/CategorySection';
import TrendingEventsSection from '@/components/app/TrendingEventsSection';
import MainHeroSection from '@/components/app/MainHeroSection';

export default async function MarketplaceHomePage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <MainHeroSection />
      <div className="flex flex-col pt-4 px-12">
        <TrendingEventsSection />
        {Object.values(categories).map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
