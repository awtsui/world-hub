import {
  Currency,
  Event,
  EventApprovalStatus,
  HostProfile,
  MainCategory,
  Media,
  Order,
  TicketWithData,
  UserProfile,
  Venue,
  WorldIdVerificationLevel,
} from '@/lib/types';
import Big from 'big.js';

export const mockCategoryIdToName: Record<string, string> = {
  '1': 'Concerts',
};

export const mockSubCategoryIdToName: Record<string, string> = {
  '101': 'EDM',
  '102': 'Pop',
  '103': 'Hip-Hop',
};

export const mockCategories: Record<string, MainCategory> = {
  '1': {
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
  },
};

export const mockEvents: Event[] = [
  {
    eventId: '1',
    title: 'Knock2',
    subTitle: 'Oonts oonts',
    hostId: '1',
    category: 'Concerts',
    subCategory: 'EDM',
    mediaId: '65ab5ed11478dc081df51250',
    datetime: new Date('2024-01-25T00:43:00.000+00:00'),
    currency: Currency.USD,
    description:
      'Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    venueId: '1',
    lineup: ['1'],
    purchaseLimit: 2,
    ticketTiers: [
      {
        label: 'GA',
        price: '10',
        quantity: 100,
        ticketsPurchased: 0,
      },
    ],
    approvalStatus: EventApprovalStatus.Approved,
    totalSold: 0,
    verificationLevel: WorldIdVerificationLevel.Orb,
  },
  {
    eventId: '2',
    title: "Michael's Party",
    subTitle: 'Party party',
    hostId: '1',
    category: 'Concerts',
    subCategory: 'EDM',
    mediaId: '65ac68f6962173289df7f951',
    datetime: new Date('2024-01-25T00:43:00.000+00:00'),
    currency: Currency.USD,
    description:
      'Lorem Ipsum is the single greatest threat. We are not - we are not keeping up with other websites. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. Does everybody know that pig named Lorem Ipsum? An ‘extremely credible source’ has called my office and told me that Barack Obama’s placeholder text is a fraud.',
    venueId: '1',
    lineup: ['1'],
    purchaseLimit: 2,
    ticketTiers: [
      {
        label: 'GA',
        price: '10',
        quantity: 100,
        ticketsPurchased: 0,
      },
    ],
    approvalStatus: EventApprovalStatus.Approved,
    totalSold: 0,
    verificationLevel: WorldIdVerificationLevel.Orb,
  },
];

export const mockHostProfiles: HostProfile[] = [
  {
    hostId: '1',
    name: 'Alvin Tsui',
    biography: '',
    mediaId: '65ab5abe40a5d5db9a4090a8',
    events: ['1', '2'],
  },
  {
    hostId: '2',
    name: 'dom',
    biography: '',
    mediaId: '',
    events: [],
  },
];

export const mockVenues: Venue[] = [
  {
    venueId: '2',
    name: 'Golden 1 Center',
    address: '500 David J Stern Walk',
    city: 'Sacramento',
    state: 'CA',
    zipcode: '95814',
    parking: ['Across the street'],
  },
  {
    venueId: '1',
    name: 'Exchange LA',
    address: '618 S. Spring Street',
    city: 'Los Angeles',
    state: 'CA',
    zipcode: '90014',
    parking: ['Next to venue'],
  },
];

export const mockMedias: Media[] = [
  {
    type: 'image/jpeg',
    fileName: 'test-file',
    url: 'https://test.example.com',
    description: 'test-file',
  },
];

export const mockTickets: Record<string, TicketWithData> = {
  '1:GA': {
    eventTitle: 'Knock2',
    price: '10',
    label: 'GA',
    currency: Currency.USD,
    eventId: '1',
    unitAmount: 1,
  },
  '2:GA': {
    eventTitle: "Michael's Party",
    price: '10',
    label: 'GA',
    currency: Currency.USD,
    eventId: '2',
    unitAmount: 1,
  },
};

export const mockUserProfile: UserProfile = {
  userId: 'test-id',
  orders: ['1', '2'],
};

export const mockOrders: Order[] = [
  {
    amount: 1,
    email: 'test@gmail.com',
    isPaid: true,
    ticketData: [
      { eventTitle: 'Knock2', price: '10', label: 'GA', currency: Currency.USD, eventId: '1', unitAmount: 1 },
    ],
    tickets: [],
    timestamp: new Date(Date.now()),
    totalPrice: Big('10'),
    userId: 'test-id',
  },
  {
    amount: 1,
    email: 'test@gmail.com',
    isPaid: true,
    ticketData: [
      { eventTitle: "Michael's Party", price: '10', label: 'GA', currency: Currency.USD, eventId: '2', unitAmount: 1 },
    ],
    tickets: [],
    timestamp: new Date(Date.now()),
    totalPrice: Big('20'),
    userId: 'test-id',
  },
];
