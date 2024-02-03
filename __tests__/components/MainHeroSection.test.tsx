import { render, screen } from '@testing-library/react';
import { getHeroHostProfile, getMediaById, getUpcomingEventByHostId, getVenueById } from '@/lib/actions';
import MainHeroSection from '@/components/app/MainHeroSection';
import { mockEvents, mockHostProfiles, mockVenues } from '@/lib/data/__mocks__';

jest.mock('../../src/lib/actions.ts', () => ({
  getHeroHostProfile: jest.fn(),
  getUpcomingEventByHostId: jest.fn(),
  getVenueById: jest.fn(),
  getMediaById: jest.fn(),
}));

const mockGetHeroHostProfile = getHeroHostProfile as jest.Mock;
const mockGetUpcomingEventByHostId = getUpcomingEventByHostId as jest.Mock;
const mockGetVenueById = getVenueById as jest.Mock;
const mockGetMediaById = getMediaById as jest.Mock;

describe('MainHeroSection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('successfully renders component', async () => {
    mockGetHeroHostProfile.mockReturnValue(mockHostProfiles[0]);
    mockGetUpcomingEventByHostId.mockReturnValue(mockEvents[0]);
    mockGetVenueById.mockReturnValue(mockVenues[0]);
    mockGetMediaById.mockReturnValue(undefined);
    render(await MainHeroSection());
  });
  it('successfully renders host name', async () => {
    mockGetHeroHostProfile.mockReturnValue(mockHostProfiles[0]);
    mockGetUpcomingEventByHostId.mockReturnValue(mockEvents[0]);
    mockGetVenueById.mockReturnValue(mockVenues[0]);
    mockGetMediaById.mockReturnValue(undefined);
    render(await MainHeroSection());

    expect(screen.getByText('Alvin Tsui')).toBeInTheDocument();
  });
});
