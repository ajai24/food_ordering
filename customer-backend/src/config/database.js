import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  // Connection options
  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds for MongoDB Atlas
    socketTimeoutMS: 45000, // 45 seconds
  };

  try {
    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    await mongoose.connect(mongoUri, options);

    // Event listeners for connection
    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    db.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    db.on('disconnected', () => {
      console.log('ℹ️ MongoDB disconnected');
    });

    console.log('✅ Customer backend connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error:', error);
    // Don't exit process - let the app continue and retry
    throw error;
  }
};
