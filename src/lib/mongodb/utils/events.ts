import { z } from 'zod';
import Event from '../models/Event';
import { generateUUID } from '@/lib/server/utils';
import { CURRENCIES } from '@/lib/constants';
import HostProfile from '../models/HostProfile';
import Media from '../models/Media';
import { EventDataRequestBodySchema } from '@/lib/zod/apischema';
import { ClientSession } from 'mongoose';
import { EventApprovalStatus } from '@/lib/types';
import { deleteMedia } from './medias';

const { AWS_S3_BUCKET_NAME } = process.env;

if (!AWS_S3_BUCKET_NAME) throw new Error('AWS_S3_BUCKET_NAME not defined');

type EventDataRequestBody = z.infer<typeof EventDataRequestBodySchema>;

export async function createEvent(data: EventDataRequestBody, tokenId: string, session?: ClientSession) {
  const { event, hostId, mediaId } = data;

  try {
    if (tokenId !== hostId) {
      throw Error('Not authorized to create this event');
    }

    const eventId = generateUUID();

    const media = await Media.findByIdAndUpdate(
      mediaId,
      {
        description: 'Event banner image',
      },
      { session },
    );

    if (!media) {
      throw Error('Media file can not be found');
    }

    const newEvent = await Event.create(
      [
        {
          eventId,
          title: event.title.trim(),
          subTitle: event.subTitle?.trim(),
          hostId,
          category: event.category,
          subCategory: event.subcategory,
          mediaId: media._id.toString(),
          datetime: event.datetime,
          currency: CURRENCIES.USD,
          description: event.description.trim(),
          venueId: event.venueId,
          lineup: event.lineup,
          purchaseLimit: event.purchaseLimit,
          ticketTiers: event.ticketTiers.map((ticketTier) => ({
            ...ticketTier,
            ticketsPurchased: 0,
          })),
          approvalStatus: EventApprovalStatus.Pending,
          totalSold: 0,
          verificationLevel: event.verificationLevel,
        },
      ],
      { session },
    );

    await HostProfile.findOneAndUpdate(
      {
        hostId,
      },
      {
        $push: {
          events: eventId,
        },
      },
      { session },
    );

    return { success: true, eventId };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}

export async function deleteEvent(eventId: string, tokenId: string, session?: ClientSession) {
  try {
    const event = await Event.findOne({ eventId }, null, { session });

    if (event.hostId !== tokenId) {
      throw Error('Not authorized to delete this event');
    }

    await Event.deleteOne({ eventId });

    await HostProfile.updateOne({ hostId: event.hostId }, { $pull: { events: eventId } }, { session });

    const deleteMediaResp = await deleteMedia(event.mediaId, session);
    if (!deleteMediaResp.success) {
      throw Error(deleteMediaResp.error);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
