import { Venue } from '@/lib/types';

export const venues: Venue[] = [
  {
    venueId: '1',
    name: 'Exchange LA',
    address: '618 S. Spring Street',
    city: 'Los Angeles',
    state: 'CA',
    zipcode: '90014',
    parking: ['Next to venue'],
  },
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
    venueId: '3',
    name: '',
    address: '420 Mason St',
    city: 'San Francisco',
    state: 'CA',
    zipcode: '94102',
    parking: ['In front of the venue'],
  },
];
