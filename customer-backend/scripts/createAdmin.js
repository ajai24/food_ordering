import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  username: 'admin',  // Change this to your desired admin username
  email: 'admin@example.com',  // Change this to your admin email
  password: 'Admin@123',  // Change this to a strong password
  accountType: 'system_admin',
  profileInfo: {
    firstName: 'Admin',
    lastName: 'User'
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    const { User } = await import('../src/models/User.js');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
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
      status: 'active'
    });

    await user.save();
    console.log('Admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createAdminUser();
};

run();
