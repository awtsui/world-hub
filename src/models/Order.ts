import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    items: Object,
    userId: String,
    isPaid: Boolean,
  },
  { timestamps: true }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
