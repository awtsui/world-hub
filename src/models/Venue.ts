import { Schema, model, models } from 'mongoose';
import { IVenue } from '@/types';

const VenueSchema = new Schema<IVenue>(
  {
    venueId: String,
    name: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
    parking: [String],
  },
  { collection: 'venues' }
);

const Venue = models.Venue || model('Venue', VenueSchema);

export default Venue;
