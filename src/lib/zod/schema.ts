import { VerificationLevel } from '@worldcoin/idkit';
import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ImageFileSchema = z
  .any()
  .refine(
    (file) => file && file?.size <= MAX_FILE_SIZE,
    `Max file size is 10MB.`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    '.jpg, .jpeg, .png and .webp files are accepted.'
  );

export const EventFormDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subTitle: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  thumbnailImage: ImageFileSchema,
  datetime: z.coerce.date(),
  description: z.string().min(1, 'Description is required'),
  lineup: z
    .object({
      label: z.string(),
      value: z.string(),
      key: z.string(),
    })
    .array(),
  venueId: z.string().min(1, 'Venue name is required'),
  purchaseLimit: z.number().positive('Purchase limit must be positive'),
  ticketTiers: z
    .object({
      label: z.string().min(1, 'Ticket tier label is required'),
      price: z.number().multipleOf(0.01, 'Invalid price'),
      quantity: z.number().positive('Ticket quantity must be positive'),
    })
    .array(),
  verificationLevel: z.enum(['orb', 'device']),
});

export const CredentialsSignUpFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  });

export const CredentialsSignInFormSchema = z.object({
  email: z.string().email('Email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const UpdateHostProfileFormSchema = z
  .object({
    name: z.string(),
    biography: z.string(),
  })
  .refine(({ name, biography }) => name !== '' || biography !== '', {
    message: 'One of the fields must be defined',
  });

export const UpdateUserAccountFormSchema = z.object({
  email: z.string().email(),
});

export const ContactFormSchema = z.object({
  name: z.string(),
  subject: z.string(),
  company: z.string().optional(),
  email: z.string(),
  message: z.string(),
});
