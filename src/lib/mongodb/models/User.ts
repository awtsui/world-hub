import { Schema, model, models } from 'mongoose';
import { IUser } from '@/lib/types';

const UserSchema = new Schema<IUser>(
  {
    userId: String,
    worldId: String,
    orders: [String],
  },
  { collection: 'users' }
);

const User = models.User || model('User', UserSchema);

export default User;
