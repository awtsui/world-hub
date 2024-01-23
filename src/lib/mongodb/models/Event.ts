import { Schema, model, models } from 'mongoose';
import { EventApprovalStatus, IEvent, WorldIdVerificationLevel } from '@/lib/types';
import { Decimal128 } from 'mongodb';

const EventSchema = new Schema<IEvent>(
  {
    eventId: String,
    title: String,
    subTitle: String,
    hostId: String,
    category: String,
    subCategory: String,
    mediaId: String,
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
        quantity: Number,
        ticketsPurchased: Number,
      },
    ],
    approvalStatus: {
      type: String,
      enum: EventApprovalStatus,
      default: EventApprovalStatus.Pending,
    },
    totalSold: Number,
    verificationLevel: {
      type: String,
      enum: WorldIdVerificationLevel,
      default: WorldIdVerificationLevel.Orb,
    },
  },
  { collection: 'events' },
);

const Event = models.Event || model('Event', EventSchema);

export default Event;
