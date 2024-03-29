import mongoose, { ClientSession } from 'mongoose';
import dbConnect from './mongoosedb';
import User from '../models/User';
import UserProfile from '../models/UserProfile';
import { z } from 'zod';
import { UserAccountDataRequestBodySchema } from '@/lib/zod/apischema';

type UserAccountDataRequestBody = z.infer<typeof UserAccountDataRequestBodySchema>;

export async function signUpIfNewUser(userId: string) {
  await dbConnect();
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      return {
        success: true,
        isVerified: existingUser.isVerified,
        email: existingUser.email,
      };
    }

    const newUser = await User.create(
      [
        {
          userId,
          email: '',
          isVerified: false,
        },
      ],
      { session },
    );

    const newUserProfile = await UserProfile.create(
      [
        {
          userId,
          orders: [],
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return { success: true, isVerified: false };
  } catch (error) {
    await session.abortTransaction();
    return { success: false, error: JSON.stringify(error) };
  } finally {
    await session.endSession();
  }
}

export async function updateUserAccount(data: UserAccountDataRequestBody, tokenId: string, session?: ClientSession) {
  const { userId, email } = data;
  try {
    if (userId !== tokenId) {
      throw Error('Not authorized to update this user account');
    }
    const existingUser = await User.findOneAndUpdate({ userId }, { email }, { session });
    if (!existingUser) {
      throw Error('User account does not exist');
    }
    return { success: true, userId };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
