import { categories, categoryIdToName } from '@/lib/data';
import { Event } from '@/lib/types';
import CategoryDropdown from '@/components/app/CategoryDropdown';
import { getApprovedEventsByCategory } from '@/lib/actions';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import CategorySection from '@/components/app/CategorySection';

type CategoryPageParams = {
  params: {
    categoryId: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageParams) {
  // TODO: Organize events based on subcategory
  // Replace with data fetching

  const { categoryId } = params;
  const categoryName = categoryIdToName[categoryId];
  const category = categories[categoryId];
  const subCategories = categories[categoryId].subCategories;

  const events: Event[] = await getApprovedEventsByCategory(categoryName);

  if (!events) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-12">
      <div className="relative">
        <AspectRatio ratio={3 / 1} className="w-full">
          <Image
            src="/homebg2.png"
            alt="category-bg"
            fill
            className="object-cover "
          />
        </AspectRatio>
        <div className="absolute top-10 left-14">
          <div className="flex items-center gap-10">
            <p className="text-5xl text-white font-bold">{categoryName}</p>
            <div className="mt-2">
              <CategoryDropdown categoryId={params.categoryId} />
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 py-4">
        {Object.values(subCategories).map((subCategory) => (
          <CategorySection
            key={subCategory.id}
            category={category}
            subCategory={subCategory}
            events={events}
          />
        ))}
      </div>
    </div>
  );
}
