import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined.');
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Partner backend connected to MongoDB');
  } catch (error) {
    console.error('Partner backend MongoDB connection failed', error.message);
    throw error;
  }
};
