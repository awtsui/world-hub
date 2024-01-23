import { render, screen } from '@testing-library/react';
import CategorySection from '../../src/components/app/CategorySection';
import { MainCategory } from '@/lib/types';
import { mockEvents } from '@/lib/data/__mocks__';
import EventsCarousel, { EventsCarouselProps } from '@/components/__mocks__/EventsCarousel';

jest.mock('../../src/components/EventsCarousel.tsx', () => ({ events }: EventsCarouselProps) => {
  return <EventsCarousel events={events} />;
});

const mockCategory: MainCategory = {
  name: 'Concerts',
  id: '1',
  subCategories: [
    {
      name: 'EDM',
      id: '101',
    },
    {
      name: 'Pop',
      id: '102',
    },
    {
      name: 'Hip-Hop',
      id: '103',
    },
  ],
};

afterAll(() => {
  jest.clearAllMocks();
});

describe('CategorySection', () => {
  it('renders a link with the category name', () => {
    render(<CategorySection category={mockCategory} events={mockEvents} />);

    const link = screen.getByRole('link');

    expect(link).toHaveTextContent('Concerts');
  });
  it('renders an EventsCarousel component', () => {
    render(<CategorySection category={mockCategory} events={mockEvents} />);

    const carousel = screen.getByTestId('events-carousel');

    expect(carousel).toBeInTheDocument();
  });
});
