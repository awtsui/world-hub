import { ITicketWithHash } from '@/lib/types';
import { Schema, model, models } from 'mongoose';

const TicketSchema = new Schema<ITicketWithHash>(
  {
    eventId: String,
    label: String,
    hash: String,
    hasValidated: Boolean,
    isExpired: Boolean,
  },

  { collection: 'tickets' }
);

const Ticket = models.Ticket || model('Ticket', TicketSchema);

export default Ticket;
