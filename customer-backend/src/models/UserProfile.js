import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    label: String,
    street: String,
    city: String,
    state: String,
    postalCode: String
  },
  { _id: false }
);

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    fullName: String,
    phone: String,
    addresses: [addressSchema]
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
