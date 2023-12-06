import { Schema, model, models } from 'mongoose';
import { Event as IEvent } from '@/types';

const EventSchema = new Schema<IEvent>(
  {
    eventId: Number,
    eventName: String,
    profileId: String,
    category: String,
    subCategory: String,
    thumbnailUrl: String,
    eventDatetime: Date,
    price: String,
    description: String,
  },
  { collection: 'events' }
);

const Event = models.Event || model('Event', EventSchema);

export default Event;
