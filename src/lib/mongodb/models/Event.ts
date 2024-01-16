import { Schema, model, models } from 'mongoose';
import { EventApprovalStatus, IEvent } from '@/lib/types';
import { Decimal128 } from 'mongodb';

const EventSchema = new Schema<IEvent>(
  {
    eventId: String,
    title: String,
    subTitle: String,
    hostId: String,
    category: String,
    subCategory: String,
    thumbnailUrl: String,
    datetime: Date,
    currency: String,
    description: String,
    venueId: String,
    lineup: [String],
    purchaseLimit: Number,
    ticketTiers: [
      {
        label: String,
        price: Decimal128,
      },
    ],
    ticketsPurchased: Number,
    ticketQuantity: Number,
    approvalStatus: {
      type: String,
      enum: EventApprovalStatus,
      default: EventApprovalStatus.Pending,
    },
  },
  { collection: 'events' }
);

const Event = models.Event || model('Event', EventSchema);

export default Event;
