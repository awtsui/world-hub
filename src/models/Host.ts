import { Schema, model, models } from 'mongoose';
import { IHost } from '@/types';

const HostSchema = new Schema<IHost>(
  {
    hostId: String,
    name: String,
    biography: String,
    events: [String],
  },

  { collection: 'hosts' }
);

const Host = models.Host || model('Host', HostSchema);

export default Host;
