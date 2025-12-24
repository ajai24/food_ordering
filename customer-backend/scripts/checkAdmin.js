import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check admin user
const checkAdminUser = async () => {
  try {
    const { User } = await import('../src/models/User.js');
    
    // Check if admin exists
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      console.log('Admin user not found in the database');
      return;
    }

    console.log('Admin user found:');
    console.log(JSON.stringify({
      email: admin.email,
      accountType: admin.accountType,
      status: admin.status,
      createdAt: admin.createdAt,
      hasPassword: !!admin.passwordHash,
      passwordHash: admin.passwordHash ? '***' : 'Not set',
      salt: admin.salt ? '***' : 'Not set'
    }, null, 2));
    
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await checkAdminUser();
};

run();
