import { VenueDataRequestBodySchema } from '@/lib/zod/apischema';
import { ClientSession } from 'mongoose';
import { z } from 'zod';
import Venue from '../models/Venue';
import { generateUUID } from '@/lib/server/utils';

type VenueDataRequestBody = z.infer<typeof VenueDataRequestBodySchema>;

export async function uploadVenue(data: VenueDataRequestBody, session?: ClientSession) {
  try {
    const venueId = generateUUID();
    const newVenue = await Venue.create(
      [
        {
          venueId,
          ...data,
        },
      ],
      { session },
    );
    return { success: true, venueId };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
