import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: String,
    name: String,
    quantity: { type: Number, default: 1 },
    price: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'completed', 'cancelled'],
      default: 'pending'
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentId: String
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
