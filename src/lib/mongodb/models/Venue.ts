import { Schema, model, models } from 'mongoose';
import { IVenue } from '@/lib/types';

const VenueSchema = new Schema<IVenue>(
  {
    venueId: String,
    name: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
    parking: [String],
    location: {
      latitude: Number,
      longitude: Number,
    },
  },
  { collection: 'venues' },
);

const Venue = models.Venue || model('Venue', VenueSchema);

export default Venue;
