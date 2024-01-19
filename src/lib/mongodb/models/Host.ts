import { HostApprovalStatus, IHost } from '@/lib/types';
import { Schema, model, models } from 'mongoose';

const HostSchema = new Schema<IHost>(
  {
    hostId: String,
    name: String,
    email: String,
    password: String,
    approvalStatus: {
      type: String,
      enum: HostApprovalStatus,
      default: HostApprovalStatus.Pending,
    },
  },

  { collection: 'hosts' }
);

const Host = models.Host || model('Host', HostSchema);

export default Host;
