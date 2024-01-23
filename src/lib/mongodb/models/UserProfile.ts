import { Schema, model, models } from 'mongoose';
import { IUserProfile } from '@/lib/types';

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: String,
    orders: [String],
  },

  { collection: 'userprofiles' },
);

const UserProfile = models.UserProfile || model('UserProfile', UserProfileSchema);

export default UserProfile;
