import { render, screen } from '@testing-library/react';
import CategorySection from '../../src/components/app/CategorySection';
import { mockCategory, mockEvents } from '@/lib/data/__mocks__';
import EventsCarousel, { EventsCarouselProps } from '@/components/__mocks__/EventsCarousel';
import { getTrendingEventsByCategory, getTrendingEventsBySubcategory } from '@/lib/actions';

jest.mock('../../src/components/EventsCarousel.tsx', () => ({ events }: EventsCarouselProps) => {
  return <EventsCarousel events={events} />;
});
jest.mock('../../src/lib/actions.ts', () => ({
  getTrendingEventsByCategory: jest.fn(),
  getTrendingEventsBySubcategory: jest.fn(),
}));

const mockGetTrendingEventsByCategory = getTrendingEventsByCategory as jest.Mock;
const mockGetTrendingEventsBySubcategory = getTrendingEventsBySubcategory as jest.Mock;

// TODO: test subcategory

describe('CategorySection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders a link with the category name', async () => {
    mockGetTrendingEventsByCategory.mockReturnValue(mockEvents);
    render(await CategorySection({ category: mockCategory }));

    const link = screen.getByRole('link');

    expect(link).toHaveTextContent('Concerts');
  });
  it('renders an EventsCarousel component', async () => {
    mockGetTrendingEventsByCategory.mockReturnValue(mockEvents);

    render(await CategorySection({ category: mockCategory }));

    const carousel = screen.getByTestId('events-carousel');

    expect(carousel).toBeInTheDocument();
  });
});
