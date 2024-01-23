import { render, screen, waitFor } from '@testing-library/react';
import EventPage from '@/app/app/event/[eventId]/page';
import GoogleMapView, { GoogleMapViewProps } from '@/components/app/__mocks__/GoogleMapView';
import { getEventById, getHostProfileByIds, getMediaById, getVenueById } from '@/lib/actions';
import AddTicketDialog, { AddTicketDialogProps } from '@/components/app/__mocks__/AddTicketDialog';
import { mockEvents, mockHostProfiles, mockMedias, mockVenues } from '@/lib/data/__mocks__';

jest.mock('../../src/lib/actions.ts', () => ({
  getEventById: jest.fn(),
  getHostProfileByIds: jest.fn(),
  getMediaById: jest.fn(),
  getVenueById: jest.fn(),
}));

jest.mock('../../src/components/app/GoogleMapView', () => ({ address }: GoogleMapViewProps) => {
  return <GoogleMapView address={address} />;
});

jest.mock('../../src/components/app/AddTicketDialog', () => ({ event }: AddTicketDialogProps) => {
  return <AddTicketDialog event={event} />;
});

afterAll(() => {
  jest.clearAllMocks();
});

const mockedGetEventById = getEventById as jest.Mock;
const mockedGetHostProfileByIds = getHostProfileByIds as jest.Mock;
const mockedGetMediaById = getMediaById as jest.Mock;
const mockedGetVenueById = getVenueById as jest.Mock;

beforeEach(() => {
  mockedGetEventById.mockResolvedValue(mockEvents[0]);
  mockedGetHostProfileByIds.mockResolvedValue(mockHostProfiles);
  mockedGetMediaById.mockResolvedValue(mockMedias[0]);
  mockedGetVenueById.mockResolvedValue(mockVenues[0]);
});

afterAll(() => {
  jest.clearAllMocks();
});

describe('EventPage', () => {
  it('renders event banner image', async () => {
    const props = {
      params: {
        eventId: '1',
      },
    };
    render(await EventPage(props));

    await waitFor(() => {
      const image = screen.getByAltText('event-banner-image-1');
      expect(image).toBeInTheDocument();
    });
  });
  it('calls each server action once', async () => {
    const props = {
      params: {
        eventId: '1',
      },
    };
    render(await EventPage(props));

    await waitFor(() => {
      expect(mockedGetEventById).toHaveBeenCalledTimes(1);
      expect(mockedGetHostProfileByIds).toHaveBeenCalledTimes(1);
      expect(mockedGetMediaById).toHaveBeenCalledTimes(1);
      expect(mockedGetVenueById).toHaveBeenCalledTimes(1);
    });
  });
  it('renders add ticket dialog', async () => {
    const props = {
      params: {
        eventId: '1',
      },
    };
    render(await EventPage(props));

    await waitFor(() => {
      const addTicketDialog = screen.getByTestId('add-ticket-dialog');
      expect(addTicketDialog).toBeInTheDocument();
    });
  });
  it('renders google map view', async () => {
    const props = {
      params: {
        eventId: '1',
      },
    };
    render(await EventPage(props));

    await waitFor(() => {
      const googleMapView = screen.getByTestId('google-map-view');
      expect(googleMapView).toBeInTheDocument();
    });
  });
  it('renders add ticket dialog', async () => {
    const props = {
      params: {
        eventId: '1',
      },
    };
    render(await EventPage(props));

    await waitFor(() => {
      const addTicketDialog = screen.getByTestId('add-ticket-dialog');
      expect(addTicketDialog).toBeInTheDocument();
    });
  });
  //   it('renders error page if event does not exist', async () => {
  //     mockedGetEventById.mockImplementation(() => {
  //       throw Error('Event does not exist');
  //     });
  //     const props = {
  //       params: {
  //         eventId: '1',
  //       },
  //     };
  //     render(await EventPage(props));

  //     await waitFor(() => {
  //       const errorButton = screen.getByText('Try Again');
  //       expect(errorButton).toBeInTheDocument();
  //     });
  //   });
});
