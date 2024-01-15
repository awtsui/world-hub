import { z } from 'zod';
import dbConnect from './mongoosedb';
import Event from '../models/Event';
import { getUniqueEventId } from '@/lib/server/utils';
import { CURRENCIES } from '@/lib/constants';
import HostProfile from '../models/HostProfile';
import Media from '../models/Media';
import { EventDataRequestBodySchema } from '@/lib/zod/apischema';
import getS3Client from '@/lib/aws-s3/s3client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import mongoose, { ClientSession } from 'mongoose';

const { AWS_S3_BUCKET_NAME } = process.env;

if (!AWS_S3_BUCKET_NAME) throw new Error('AWS_S3_BUCKET_NAME not defined');

type EventDataRequestBody = z.infer<typeof EventDataRequestBodySchema>;

export async function createEvent(
  data: EventDataRequestBody,
  tokenId: string,
  session?: ClientSession
) {
  const { event, hostId, mediaId } = data;

  try {
    if (tokenId !== hostId) {
      throw Error('Not authorized to create this event');
    }

    const eventId = await getUniqueEventId();

    const media = await Media.findByIdAndUpdate(
      mediaId,
      {
        eventId,
      },
      { session }
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
          thumbnailUrl: media.url,
          datetime: event.datetime,
          currency: CURRENCIES.USD,
          description: event.description.trim(),
          venueId: event.venueId,
          lineup: event.lineup,
          purchaseLimit: event.purchaseLimit,
          ticketTiers: event.ticketTiers,
          ticketsPurchased: 0,
          ticketQuantity: event.ticketQuantity,
        },
      ],
      { session }
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
      { session }
    );

    return { success: true, eventId };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}

export async function deleteEvent(
  eventId: string,
  tokenId: string,
  session?: ClientSession
) {
  try {
    const event = await Event.findOneAndDelete({ eventId }, { session });

    if (!event) {
      throw Error('Unable to delete event');
    }

    if (event.hostId !== tokenId) {
      throw Error('Not authorized to delete this event');
    }

    const hostProfile = await HostProfile.findOneAndUpdate(
      { hostId: event.hostId },
      { $pull: { events: eventId } },
      { session }
    );

    const media = await Media.findOneAndDelete(
      {
        eventId,
      },
      { session }
    );

    if (!media) {
      throw Error('Unable to delete media');
    }

    const s3Client = getS3Client();
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: media.url.split('/').pop()!,
    });
    await s3Client.send(deleteObjectCommand);

    return { success: true };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
