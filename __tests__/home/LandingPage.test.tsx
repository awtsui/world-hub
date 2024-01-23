import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/home/page';

describe('LandingPage', () => {
  it('renders a background image', () => {
    render(<LandingPage />);

    const image = screen.getByAltText('landing-bg');
    expect(image).toBeInTheDocument();
  });
  it('renders a button', () => {
    render(<LandingPage />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
  it('renders a link', () => {
    render(<LandingPage />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
  it('renders a link with href to app marketplace', () => {
    render(<LandingPage />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('//app.'));
  });
});
