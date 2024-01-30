import { render, screen } from '@testing-library/react';
import { mockEvents } from '@/lib/data/__mocks__';
import EventsCarousel, { EventsCarouselProps } from '@/components/__mocks__/EventsCarousel';
import TrendingEventsSection from '@/components/app/TrendingEventsSection';
import { getTrendingEvents } from '@/lib/actions';

jest.mock('../../src/components/EventsCarousel.tsx', () => ({ events }: EventsCarouselProps) => {
  return <EventsCarousel events={events} />;
});

jest.mock('../../src/lib/actions.ts', () => ({
  getTrendingEvents: jest.fn(),
}));

const mockGetTrendingEvents = getTrendingEvents as jest.Mock;

describe('TrendingEventsSection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('renders an EventsCarousel component if there are popular events', async () => {
    mockGetTrendingEvents.mockReturnValue(mockEvents);
    render(await TrendingEventsSection());

    const carousel = screen.getByTestId('events-carousel');

    expect(carousel).toBeInTheDocument();
  });
  it('does not render an EventsCarousel component if there are no popular events', async () => {
    mockGetTrendingEvents.mockReturnValue([]);
    render(await TrendingEventsSection());

    expect(screen.queryByTestId('events-carousel')).not.toBeInTheDocument();
  });
});
