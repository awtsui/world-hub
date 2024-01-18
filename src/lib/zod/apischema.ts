import { z } from 'zod';

export const EventDataRequestBodySchema = z.object({
  hostId: z.string(),
  mediaId: z.string(),
  event: z.object({
    title: z.string().min(1, 'Title is required'),
    subTitle: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().min(1, 'Subcategory is required'),
    datetime: z.coerce.date(),
    description: z.string().min(1, 'Description is required'),
    lineup: z.string().array(),
    venueId: z.string().min(1, 'Venue name is required'),
    purchaseLimit: z.number().positive('Ticket limit must be positive'),
    ticketTiers: z
      .object({
        label: z.string().min(1, 'Ticket tier label is required'),
        price: z.number().multipleOf(0.01, 'Invalid price'),
        quantity: z.number().positive('Ticket quantity must be positive'),
      })
      .array(),
    verificationLevel: z.enum(['orb', 'device']),
  }),
});

export const HostProfileDataRequestBodySchema = z
  .object({
    hostId: z.string(),
    name: z.string(),
    biography: z.string(),
  })
  .refine(({ name, biography }) => name !== '' || biography !== '', {
    message: 'One of the fields must be defined',
  });

export const StripeSessionDataRequestBodySchema = z.object({
  tickets: z
    .object({
      price: z.string(),
      unitAmount: z.number(),
      currency: z.string(),
      eventTitle: z.string(),
      eventId: z.string(),
      label: z.string(),
    })
    .array()
    .nonempty(),
  userId: z.string(),
  email: z.string().email().optional(),
});

export const TicketGeneratorDataRequestBodySchema = z.object({
  ticketId: z.string(),
});

export const TicketValidatorDataRequestBodySchema = z.object({
  hash: z
    .string()
    .regex(/^.+,\$2a\$[\$\.\/A-Za-z0-9]+$/, 'Hash does not meet schema'),
  eventId: z.string(),
});

export const UserAccountDataRequestBodySchema = z.object({
  email: z.string().email(),
  userId: z.string(),
});

export const WorldcoinVerificationDataRequestBodySchema = z.object({
  merkle_root: z.string().startsWith('0x'),
  nullifier_hash: z.string().startsWith('0x'),
  proof: z.string().startsWith('0x'),
  verification_level: z.enum(['orb', 'device']),
  action: z.string(),
  signal: z.string(),
});
