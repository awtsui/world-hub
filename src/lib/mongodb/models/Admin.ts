import { Schema, model, models } from 'mongoose';

const AdminSchema = new Schema(
  {
    adminId: String,
    email: String,
    password: String,
    adminType: String,
  },

  { collection: 'admins' }
);

const Admin = models.Admin || model('Admin', AdminSchema);

export default Admin;
