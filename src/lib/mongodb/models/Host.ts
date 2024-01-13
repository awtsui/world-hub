import { Schema, model, models } from 'mongoose';

const HostSchema = new Schema(
  {
    hostId: String,
    name: String,
    email: String,
    password: String,
  },

  { collection: 'hosts' }
);

const Host = models.Host || model('Host', HostSchema);

export default Host;
