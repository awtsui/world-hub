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
      })
      .array(),
    ticketQuantity: z.number().positive('Ticket quantity must be positive'),
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
});