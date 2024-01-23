import { z } from 'zod';
import { HostProfileDataRequestBodySchema } from '@/lib/zod/apischema';
import HostProfile from '../models/HostProfile';
import { ClientSession } from 'mongoose';
import Media from '../models/Media';
import { deleteMedia } from './medias';

type HostProfileDataRequestBody = z.infer<typeof HostProfileDataRequestBodySchema>;

export async function updateHostProfile(data: HostProfileDataRequestBody, tokenId: string, session?: ClientSession) {
  const { hostId, profile } = data;

  try {
    if (tokenId !== hostId) {
      throw Error('Not authorized to update this profile');
    }

    const hostProfile = await HostProfile.findOne({ hostId }, null, {
      session,
    });

    if (!hostProfile) {
      throw Error('Host does not exist');
    }

    if (profile.name) {
      await HostProfile.updateOne(
        { hostId },
        {
          name: profile.name,
        },
        { session },
      );
    }

    if (profile.biography) {
      await HostProfile.updateOne(
        { hostId },
        {
          biography: profile.biography,
        },
        { session },
      );
    }

    if (profile.mediaId) {
      if (hostProfile.mediaId) {
        const deleteMediaResp = await deleteMedia(hostProfile.mediaId, session);
        if (!deleteMediaResp.success) {
          throw Error('Failed to delete media');
        }
      }
      const media = await Media.findById(profile.mediaId);

      if (!media) {
        throw Error('Media does not exist');
      }

      await HostProfile.updateOne(
        { hostId },
        { mediaId: profile.mediaId, description: 'Host profile picture' },
        {
          session,
        },
      );
    }

    return { success: true, hostId };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
