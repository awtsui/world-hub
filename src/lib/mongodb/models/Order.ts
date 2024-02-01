import { Schema, model, models } from 'mongoose';
import { IOrder } from '@/lib/types';
import { Decimal128 } from 'mongodb';

const OrderSchema = new Schema<IOrder>(
  {
    userId: String,
    isPaid: Boolean,
    amount: Number,
    totalPrice: Decimal128,
    ticketData: [
      {
        eventId: String,
        eventTitle: String,
        price: Decimal128,
        currency: String,
        label: String,
        unitAmount: Number,
      },
    ],
    email: String,
    timestamp: Date,
    tickets: [String],
  },

  { collection: 'orders' },
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
