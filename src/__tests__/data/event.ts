import { CURRENCIES } from '@/constants';
import { Event } from '@/types';
import Big from 'big.js';

export const events: Event[] = [
  {
    eventId: '1',
    title: 'Insomniac Presents: Cash Cash',
    subTitle: '',
    hostId: '1',
    category: 'Concerts',
    subCategory: 'EDM',
    thumbnailUrl: 'https://i.ticketweb.com//i/00/12/60/46/48_Edp.jpg?v=11',
    datetime: new Date(),
    currency: CURRENCIES.USD,
    description: '',
    venueId: '1',
    lineup: ['Cash Cash'],
    ticketLimit: 1,
    ticketTiers: [
      {
        label: 'GA',
        price: new Big(25.0),
      },
      {
        label: 'VIP',
        price: new Big(60.0),
      },
    ],
  },
  {
    eventId: '2',
    title: 'Sacramento Kings vs. Utah Jazz',
    subTitle: '',
    hostId: '2',
    category: 'Sports',
    subCategory: 'Basketball',
    thumbnailUrl:
      'https://s1.ticketm.net/dam/a/022/6fdae8b5-6fa8-4793-8829-edef2a77a022_1339671_EVENT_DETAIL_PAGE_16_9.jpg',
    datetime: new Date(),
    currency: CURRENCIES.USD,
    description: '',
    venueId: '2',
    lineup: ['Sacramento Kings', 'Utah Jazz'],
    ticketLimit: 1,
    ticketTiers: [
      {
        label: 'Sec 100, Row A',
        price: new Big(20.0),
      },
      {
        label: 'Sec 200, Row b',
        price: new Big(30.0),
      },
      {
        label: 'Sec 300, Row C',
        price: new Big(40.0),
      },
      {
        label: 'Sec 400, Row D',
        price: new Big(50.0),
      },
    ],
  },
  {
    eventId: '3',
    title: 'August Hall Presents: Rock & Roll Playhouse',
    subTitle: '',
    hostId: '3',
    category: 'Arts & Theatre',
    subCategory: "Children's Theatre",
    thumbnailUrl: 'https://i.ticketweb.com//i/00/12/08/15/53_Edp.jpg?v=9',
    datetime: new Date(),
    currency: CURRENCIES.USD,
    description: '',
    venueId: '3',
    lineup: ['Rock & Roll Playhouse'],
    ticketLimit: 1,
    ticketTiers: [
      {
        label: 'GA',
        price: new Big(28.0),
      },
    ],
  },
];
