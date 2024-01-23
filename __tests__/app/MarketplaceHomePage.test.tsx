import { render, screen, waitFor } from '@testing-library/react';
import MarketplaceHomePage from '@/app/app/marketplace/page';
import CategorySection, { CategorySectionProps } from '@/components/app/__mocks__/CategorySection';
import { mockEvents } from '@/lib/data/__mocks__';
import TrendingEventsSection, { TrendingEventsSectionProps } from '@/components/app/__mocks__/TrendingEventsSection';
import { getApprovedEvents } from '@/lib/actions';

jest.mock(
  '../../src/components/app/CategorySection.tsx',
  () =>
    ({ category, subCategory, events }: CategorySectionProps) => {
      return <CategorySection category={category} subCategory={subCategory} events={events} />;
    },
);

jest.mock('../../src/components/app/TrendingEventsSection.tsx', () => ({ events }: TrendingEventsSectionProps) => {
  return <TrendingEventsSection events={events} />;
});

jest.mock('../../src/lib/actions.ts', () => ({
  getApprovedEvents: jest.fn(),
}));

const mockGetApprovedEvents = getApprovedEvents as jest.Mock;

afterAll(() => {
  jest.clearAllMocks();
});

describe('MarketplaceHomePage', () => {
  it('renders a background image banner', async () => {
    mockGetApprovedEvents.mockResolvedValue(mockEvents);
    render(await MarketplaceHomePage());
    await waitFor(() => {
      const image = screen.getByAltText('home-bg');

      expect(image).toBeInTheDocument();
    });
  });
  it('renders TrendingEventsSection if there are events', async () => {
    mockGetApprovedEvents.mockResolvedValue(mockEvents);
    render(await MarketplaceHomePage());
    await waitFor(() => {
      const trendingEventsSection = screen.getByTestId('trending-events-section');

      expect(trendingEventsSection).toBeInTheDocument();
    });
  });
  it('renders CategorySection if there are events', async () => {
    mockGetApprovedEvents.mockResolvedValue(mockEvents);
    render(await MarketplaceHomePage());
    await waitFor(() => {
      const categorySection = screen.getAllByTestId('category-section');

      expect(categorySection).toHaveLength(1);
    });
  });
  it('calls getApprovedEvents upon rendering', async () => {
    mockGetApprovedEvents.mockResolvedValue(mockEvents);
    render(await MarketplaceHomePage());
    await waitFor(() => {
      expect(mockGetApprovedEvents).toHaveBeenCalledTimes(1);
    });
  });
});
