import { categories, categoryIdToName } from '@/lib/data';
import CategoryDropdown from '@/components/app/CategoryDropdown';
import CategorySection from '@/components/app/CategorySection';
import CategoryHeroSection from '@/components/app/CategoryHeroSection';

interface CategoryPageParams {
  params: {
    categoryId: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageParams) {
  // TODO: Organize events based on subcategory
  // Replace with data fetching

  const { categoryId } = params;
  const categoryName = categoryIdToName[categoryId];
  const category = categories[categoryId];
  const subCategories = categories[categoryId].subCategories;

  return (
    <div className="pb-20">
      <div className="relative">
        <CategoryHeroSection categoryId={params.categoryId} />
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
          <CategorySection key={subCategory.id} category={category} subCategory={subCategory} />
        ))}
      </div>
    </div>
  );
}
