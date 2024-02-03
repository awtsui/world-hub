import { render, screen, waitFor } from '@testing-library/react';
import MarketplaceHomePage from '@/app/app/marketplace/page';
import CategorySection, { CategorySectionProps } from '@/components/app/__mocks__/CategorySection';
import TrendingEventsSection from '@/components/app/__mocks__/TrendingEventsSection';
import MainHeroSection from '@/components/app/__mocks__/MainHeroSection';

jest.mock('../../src/components/app/CategorySection', () => ({ category, subCategory }: CategorySectionProps) => {
  return <CategorySection category={category} subCategory={subCategory} />;
});

jest.mock('../../src/components/app/TrendingEventsSection', () => () => {
  return <TrendingEventsSection />;
});

jest.mock('../../src/components/app/MainHeroSection', () => () => {
  return <MainHeroSection />;
});

describe('MarketplaceHomePage', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('renders TrendingEventsSection', async () => {
    render(await MarketplaceHomePage());
    expect(screen.getByTestId('trending-events-section')).toBeInTheDocument();
  });
  it('renders CategorySection', async () => {
    render(await MarketplaceHomePage());
    expect(screen.getByTestId('category-section')).toBeInTheDocument();
  });
  it('renders MainHeroSection', async () => {
    render(await MarketplaceHomePage());
    expect(screen.getByTestId('main-hero-section')).toBeInTheDocument();
  });
});
