import { Schema, model, models } from 'mongoose';
import { IHostProfile } from '@/lib/types';

const HostProfileSchema = new Schema<IHostProfile>(
  {
    hostId: String,
    name: String,
    biography: String,
    mediaId: String,
    events: [String],
  },

  { collection: 'hostprofiles' }
);

const HostProfile =
  models.HostProfile || model('HostProfile', HostProfileSchema);

export default HostProfile;
