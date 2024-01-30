import { MainCategory, SubCategory, Event } from '@/lib/types';

export interface CategorySectionProps {
  category: MainCategory;
  subCategory?: SubCategory;
}

export default function CategorySection({ category, subCategory }: CategorySectionProps) {
  return <div data-testid="category-section">mock</div>;
}
