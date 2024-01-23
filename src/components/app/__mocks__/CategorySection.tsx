import { MainCategory, SubCategory, Event } from '@/lib/types';

export interface CategorySectionProps {
  category: MainCategory;
  subCategory?: SubCategory;
  events: Event[];
}

export default function CategorySection({ category, subCategory, events }: CategorySectionProps) {
  return <div data-testid="category-section">mock</div>;
}
