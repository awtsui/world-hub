import { TicketGeneratorDataRequestBodySchema, TicketValidatorDataRequestBodySchema } from '@/lib/zod/apischema';
import { hashSync } from 'bcrypt-ts';
import { ClientSession } from 'mongoose';
import { z } from 'zod';
import Ticket from '../models/Ticket';
import { TICKET_HASH_SALT } from '@/lib/constants';
import Event from '../models/Event';

type TicketGeneratorDataRequestBody = z.infer<typeof TicketGeneratorDataRequestBodySchema>;

type TicketValidatorDataRequestBody = z.infer<typeof TicketValidatorDataRequestBodySchema>;

export async function generateTicket(data: TicketGeneratorDataRequestBody, session?: ClientSession) {
  const { ticketId } = data;
  try {
    const existingTicket = await Ticket.findById(ticketId, null, { session });
    if (!existingTicket) {
      throw Error('Ticket does not exist');
    }
    const existingEvent = await Event.findOne({ eventId: existingTicket.eventId }, null, {
      session,
    });

    if (!existingEvent || !existingEvent.ticketTiers.map((tier: any) => tier.label).includes(existingTicket.label)) {
      throw Error('Ticket details do not match an event');
    }

    const hash = hashSync(ticketId, TICKET_HASH_SALT);

    await Ticket.findByIdAndUpdate(ticketId, { hash: `${existingTicket.label},${hash}` }, { session });

    return { success: true, hash };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}

export async function validateTicket(data: TicketValidatorDataRequestBody, session?: ClientSession) {
  const { hash, eventId } = data;
  const [label, ticketHash] = hash.split(',');

  try {
    const existingTicket = await Ticket.findOne({ hash }, null, {
      session,
    });
    if (!existingTicket) {
      throw Error('Ticket does not exist for this hash');
    }

    const isValid =
      !existingTicket.isExpired &&
      !existingTicket.hasValidated &&
      existingTicket.eventId === eventId &&
      existingTicket.label === label &&
      existingTicket.hash === hash;

    await Ticket.findByIdAndUpdate(existingTicket._id.toString(), { hasValidated: true }, { session });

    return { success: isValid };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
