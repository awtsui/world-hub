import { z } from 'zod';
import { HostProfileDataRequestBodySchema } from '@/lib/zod/apischema';
import dbConnect from './mongoosedb';
import HostProfile from '../models/HostProfile';
import mongoose, { ClientSession } from 'mongoose';

type HostProfileDataRequestBody = z.infer<
  typeof HostProfileDataRequestBodySchema
>;

export async function updateHostProfile(data: HostProfileDataRequestBody) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  const { hostId, name, biography } = data;

  try {
    const hostProfile = await HostProfile.findOne({ hostId });

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

    await session.commitTransaction();

    return { success: true, hostId };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return { success: false, error: error as string };
  } finally {
    session.endSession();
  }
}
