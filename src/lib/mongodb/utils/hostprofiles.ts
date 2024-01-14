import { z } from 'zod';
import { HostProfileDataRequestBodySchema } from '@/lib/zod/apischema';
import HostProfile from '../models/HostProfile';
import { ClientSession } from 'mongoose';

type HostProfileDataRequestBody = z.infer<
  typeof HostProfileDataRequestBodySchema
>;

export async function updateHostProfile(
  data: HostProfileDataRequestBody,
  session?: ClientSession
) {
  const { hostId, name, biography } = data;

  try {
    const hostProfile = await HostProfile.findOne({ hostId }, null, {
      session,
    });

    if (!hostProfile) {
      throw Error('Host does not exist');
    }

    if (name) {
      await HostProfile.updateOne(
        { hostId },
        {
          name,
        },
        { session }
      );
    }

    if (biography) {
      await HostProfile.updateOne(
        { hostId },
        {
          biography,
        },
        { session }
      );
    }

    return { success: true, hostId };
  } catch (error) {
    console.log(error);
    return { success: false, error: error as string };
  }
}
