import { render, screen, waitFor } from '@testing-library/react';
import CheckoutPage from '@/app/app/checkout/page';
import { useSession } from 'next-auth/react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe/utils/get-stripejs';
import { useRouter } from 'next/navigation';
import { AlertModalContext, AlertModalProvider, useAlertDialog } from '@/context/ModalContext';
import { SWRConfig } from 'swr';
import { CartContext, CartProvider } from '@/context/CartContext';
import { Session } from 'next-auth';
import { AlertStatus, Role, TicketWithData, WorldIdVerificationLevel } from '@/lib/types';
import useFetchEventsByIds from '@/hooks/useFetchEventsByIds';
import useFetchOrdersByIds from '@/hooks/useFetchOrdersByIds';
import useFetchUserProfileById from '@/hooks/useFetchUserProfileById';
import { mockEvents, mockOrders, mockTickets, mockUserProfile } from '@/lib/data/__mocks__';
import useFetchStripeSession from '@/hooks/useFetchStripeSession';
import { Currency } from '@/lib/constants';

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(),
  };
});

jest.mock('@stripe/react-stripe-js', () => {
  const originalModule = jest.requireActual('@stripe/react-stripe-js');
  return {
    __esModule: true,
    ...originalModule,
    EmbeddedCheckoutProvider: ({ stripe, options, children }: { stripe: any; options: any; children: any }) => {
      return <div data-testid="embedded-checkout-provider">{children}</div>;
    },
    EmbeddedCheckout: () => {
      return <div data-testid="embedded-checkout">mock</div>;
    },
  };
});

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');
  return {
    __esModule: true,
    ...originalModule,
    useRouter: jest.fn(),
  };
});

jest.mock('../../src/hooks/useFetchEventsByIds');
jest.mock('../../src/hooks/useFetchUserProfileById');
jest.mock('../../src/hooks/useFetchOrdersByIds');
jest.mock('../../src/hooks/useFetchStripeSession');

const mockSession: Session = {
  expires: '1',
  user: { id: '1', role: Role.user, verificationLevel: WorldIdVerificationLevel.Orb },
};

const mockUseSession = useSession as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseFetchEventsByIds = useFetchEventsByIds as jest.Mock;
const mockUseFetchUserProfileById = useFetchUserProfileById as jest.Mock;
const mockUseFetchOrdersByIds = useFetchOrdersByIds as jest.Mock;
const mockUseFetchStripeSession = useFetchStripeSession as jest.Mock;
const mockPush = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();

  mockUseSession.mockReturnValue({ data: mockSession });
  mockUseFetchUserProfileById.mockReturnValue(mockUserProfile);
  mockUseFetchEventsByIds.mockReturnValue(mockEvents);
  mockUseFetchOrdersByIds.mockReturnValue(mockOrders);
  mockUseFetchStripeSession.mockImplementation(({ isValidOrder, isValidVerification, ...arg }) =>
    isValidOrder && isValidVerification ? { clientSecret: 'client-secret' } : { clientSecret: undefined },
  );
  mockUseRouter.mockReturnValue({
    query: {},
    push: mockPush,
  });
});

afterAll(() => {
  jest.clearAllMocks();
});

describe('CheckoutPage', () => {
  it('redirects when cart has no tickets', () => {
    const mockSetError = jest.fn();
    render(
      <AlertModalContext.Provider
        value={{
          alert: AlertStatus.None,
          alertText: '',
          setSuccess: jest.fn(),
          setError: mockSetError,
          setNotif: jest.fn(),
          clear: jest.fn(),
        }}
      >
        <CartContext.Provider
          value={{
            tickets: {},
            addTicket: jest.fn(),
            removeTicket: jest.fn(),
            resetCart: jest.fn(),
            isLoading: false,
          }}
        >
          <CheckoutPage />
        </CartContext.Provider>
      </AlertModalContext.Provider>,
    );
    expect(mockPush).toHaveBeenCalledWith('/marketplace');
    expect(mockSetError).toHaveBeenCalled();
    const embeddedCheckout = screen.queryByTestId('embedded-checkout');
    expect(embeddedCheckout).not.toBeInTheDocument();
  });
  it('redirects when user does not meet event verification requirements', () => {
    const mockSessionWithDeviceVerification: Session = {
      expires: '1',
      user: { id: '1', role: Role.user, verificationLevel: WorldIdVerificationLevel.Device },
    };
    mockUseSession.mockReturnValue({ data: mockSessionWithDeviceVerification });
    const mockSetError = jest.fn();
    const mockResetCart = jest.fn();
    render(
      <AlertModalContext.Provider
        value={{
          alert: AlertStatus.None,
          alertText: '',
          setSuccess: jest.fn(),
          setError: mockSetError,
          setNotif: jest.fn(),
          clear: jest.fn(),
        }}
      >
        <CartContext.Provider
          value={{
            tickets: mockTickets,
            addTicket: jest.fn(),
            removeTicket: jest.fn(),
            resetCart: mockResetCart,
            isLoading: false,
          }}
        >
          <CheckoutPage />
        </CartContext.Provider>
      </AlertModalContext.Provider>,
    );
    expect(mockPush).toHaveBeenCalledWith('/marketplace');
    expect(mockSetError).toHaveBeenCalled();
    expect(mockResetCart).toHaveBeenCalled();
    const embeddedCheckout = screen.queryByTestId('embedded-checkout');
    expect(embeddedCheckout).not.toBeInTheDocument();
  });
  it("redirects when user's past orders and current cart surpass event purchase limits", () => {
    const mockTicketsWithExcessAmount: Record<string, TicketWithData> = {
      '1:GA': {
        eventTitle: 'Knock2',
        price: '10',
        label: 'GA',
        currency: Currency.USD,
        eventId: '1',
        unitAmount: 2,
      },
    };

    const mockSetError = jest.fn();
    const mockResetCart = jest.fn();

    mockUseFetchEventsByIds.mockReturnValue([mockEvents[0]]);
    render(
      <AlertModalContext.Provider
        value={{
          alert: AlertStatus.None,
          alertText: '',
          setSuccess: jest.fn(),
          setError: mockSetError,
          setNotif: jest.fn(),
          clear: jest.fn(),
        }}
      >
        <CartContext.Provider
          value={{
            tickets: mockTicketsWithExcessAmount,
            addTicket: jest.fn(),
            removeTicket: jest.fn(),
            resetCart: mockResetCart,
            isLoading: false,
          }}
        >
          <CheckoutPage />
        </CartContext.Provider>
      </AlertModalContext.Provider>,
    );
    expect(mockPush).toHaveBeenCalledWith('/marketplace');
    expect(mockSetError).toHaveBeenCalled();
    expect(mockResetCart).toHaveBeenCalled();
    const embeddedCheckout = screen.queryByTestId('embedded-checkout');
    expect(embeddedCheckout).not.toBeInTheDocument();
  });
  it("redirects when user's current cart surpass event purchase limits", () => {
    // Events have a purchase limit of two
    const mockTicketsWithExcessAmount: Record<string, TicketWithData> = {
      '1:GA': {
        eventTitle: 'Knock2',
        price: '10',
        label: 'GA',
        currency: Currency.USD,
        eventId: '1',
        unitAmount: 3,
      },
    };

    const mockSetError = jest.fn();
    const mockResetCart = jest.fn();

    mockUseFetchEventsByIds.mockReturnValue([mockEvents[0]]);
    mockUseFetchOrdersByIds.mockReturnValue([]);
    mockUseFetchUserProfileById.mockReturnValue({ userId: 'test-id', orders: [] });

    render(
      <AlertModalContext.Provider
        value={{
          alert: AlertStatus.None,
          alertText: '',
          setSuccess: jest.fn(),
          setError: mockSetError,
          setNotif: jest.fn(),
          clear: jest.fn(),
        }}
      >
        <CartContext.Provider
          value={{
            tickets: mockTicketsWithExcessAmount,
            addTicket: jest.fn(),
            removeTicket: jest.fn(),
            resetCart: mockResetCart,
            isLoading: false,
          }}
        >
          <CheckoutPage />
        </CartContext.Provider>
      </AlertModalContext.Provider>,
    );
    expect(mockPush).toHaveBeenCalledWith('/marketplace');
    expect(mockSetError).toHaveBeenCalled();
    expect(mockResetCart).toHaveBeenCalled();
    const embeddedCheckout = screen.queryByTestId('embedded-checkout');
    expect(embeddedCheckout).not.toBeInTheDocument();
  });
  it('successfully renders EmbeddedCheckout component when user meets requirements', () => {
    render(
      <AlertModalContext.Provider
        value={{
          alert: AlertStatus.None,
          alertText: '',
          setSuccess: jest.fn(),
          setError: jest.fn(),
          setNotif: jest.fn(),
          clear: jest.fn(),
        }}
      >
        <CartContext.Provider
          value={{
            tickets: mockTickets,
            addTicket: jest.fn(),
            removeTicket: jest.fn(),
            resetCart: jest.fn(),
            isLoading: false,
          }}
        >
          <CheckoutPage />
        </CartContext.Provider>
      </AlertModalContext.Provider>,
    );
    const embeddedCheckout = screen.queryByTestId('embedded-checkout');
    expect(embeddedCheckout).toBeInTheDocument();
  });
});
