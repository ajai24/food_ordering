import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: String,
    rating: { type: Number, min: 0, max: 5, default: 0 },
    imageUrl: String,
    location: {
      address: String,
      city: String,
      postalCode: String
    },
    menu: [menuItemSchema]
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
