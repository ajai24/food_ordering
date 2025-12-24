import mongoose from 'mongoose';
import crypto from 'crypto';
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

// Admin user data
const adminUser = {
  username: 'admin',
  email: 'admin@example.com',
  password: 'Admin@123',  // This will be hashed
  accountType: 'system_admin',
  profileInfo: {
    firstName: 'Admin',
    lastName: 'User'
  },
  status: 'active'
};

// Create admin user directly
const createAdminUser = async () => {
  try {
    const { User } = await import('../src/models/User.js');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Deleting the existing one...');
      await User.deleteOne({ email: adminUser.email });
    }

    // Create salt and hash the password
    const salt = crypto.randomBytes(32).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(adminUser.password, salt, 10000, 64, 'sha512').toString('hex');
    
    // Create the admin user
    const user = new User({
      username: adminUser.username,
      email: adminUser.email,
      passwordHash,
      salt,
      accountType: adminUser.accountType,
      profileInfo: adminUser.profileInfo,
      status: adminUser.status
    });

    await user.save();
    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createAdminUser();
};

run();
