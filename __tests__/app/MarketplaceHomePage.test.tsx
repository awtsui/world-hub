import { render, screen, waitFor } from '@testing-library/react';
import MarketplaceHomePage from '@/app/app/marketplace/page';
import CategorySection, { CategorySectionProps } from '@/components/app/__mocks__/CategorySection';
import { mockEvents } from '@/lib/data/__mocks__';
import TrendingEventsSection, { TrendingEventsSectionProps } from '@/components/app/__mocks__/TrendingEventsSection';
import { getTrendingEvents, getTrendingEventsByCategory, getTrendingEventsBySubcategory } from '@/lib/actions';

jest.mock('../../src/components/app/CategorySection.tsx', () => ({ category, subCategory }: CategorySectionProps) => {
  return <CategorySection category={category} subCategory={subCategory} />;
});

jest.mock('../../src/components/app/TrendingEventsSection.tsx', () => ({}: TrendingEventsSectionProps) => {
  return <TrendingEventsSection />;
});

jest.mock('../../src/lib/actions.ts', () => ({
  getTrendingEventsByCategory: jest.fn(),
  getTrendingEventsBySubcategory: jest.fn(),
  getTrendingEvents: jest.fn(),
}));

const mockGetTrendingEventsByCategory = getTrendingEventsByCategory as jest.Mock;
const mockGetTrendingEventsBySubcategory = getTrendingEventsBySubcategory as jest.Mock;
const mockGetTrendingEvents = getTrendingEvents as jest.Mock;

describe('MarketplaceHomePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('renders a background image banner', async () => {
    render(await MarketplaceHomePage());
    await waitFor(() => {
      const image = screen.getByAltText('home-bg');

      expect(image).toBeInTheDocument();
    });
  });
  it('renders TrendingEventsSection if there are events', async () => {
    mockGetTrendingEvents.mockReturnValue(mockEvents);
    render(await MarketplaceHomePage());
    await waitFor(() => {
      const trendingEventsSection = screen.getByTestId('trending-events-section');

      expect(trendingEventsSection).toBeInTheDocument();
    });
  });
  it('renders CategorySection if there are events', async () => {
    mockGetTrendingEventsByCategory.mockReturnValue(mockEvents);
    render(await MarketplaceHomePage());
    await waitFor(() => {
      const categorySection = screen.getAllByTestId('category-section');

      expect(categorySection).toHaveLength(1);
    });
  });
});
