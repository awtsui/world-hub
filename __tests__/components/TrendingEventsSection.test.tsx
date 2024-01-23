import { render, screen } from '@testing-library/react';
import { mockEvents } from '@/lib/data/__mocks__';
import EventsCarousel, { EventsCarouselProps } from '@/components/__mocks__/EventsCarousel';
import TrendingEventsSection from '@/components/app/TrendingEventsSection';

jest.mock('../../src/components/EventsCarousel.tsx', () => ({ events }: EventsCarouselProps) => {
  return <EventsCarousel events={events} />;
});

afterAll(() => {
  jest.clearAllMocks();
});

describe('TrendingEventsSection', () => {
  it('renders an EventsCarousel component if there are popular events', () => {
    render(<TrendingEventsSection events={mockEvents} />);

    const carousel = screen.getByTestId('events-carousel');

    expect(carousel).toBeInTheDocument();
  });
  it('does not render an EventsCarousel component if there are no popular events', () => {
    render(<TrendingEventsSection events={[]} />);

    expect(screen.queryByTestId('events-carousel')).not.toBeInTheDocument();
  });
});
