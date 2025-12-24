import { User } from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';

// Rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

const generateSessionToken = () => {
  // Generate a more secure session token
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  return `sess_${randomBytes}_${timestamp}`;
};

// In-memory store for active sessions (in production, use Redis or similar)
const activeSessions = new Map();

// Middleware to validate session
export const validateSession = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  if (!activeSessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }

  const session = activeSessions.get(token);
  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return res.status(401).json({ success: false, message: 'Session expired' });
  }

  // Extend session
  session.expiresAt = Date.now() + (24 * 60 * 60 * 1000); // Extend by 24 hours
  req.user = session.user;
  next();
};

export const registerUser = async (req, res) => {
  const sessionToken = generateSessionToken();
  console.log(`[${sessionToken}] Registration attempt started`);

  try {
    const { username, email, password, accountType, profileInfo } = req.body;

    if (!username || !email || !password) {
      console.log(`[${sessionToken}] Missing required fields`);
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.',
        error: 'MISSING_FIELDS'
      });
    }

    if (!validateEmail(email)) {
      console.log(`[${sessionToken}] Invalid email format: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
        error: 'INVALID_EMAIL'
      });
    }

    if (!validatePassword(password)) {
      console.log(`[${sessionToken}] Password validation failed`);
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with one uppercase letter and one number.',
        error: 'WEAK_PASSWORD'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      console.log(`[${sessionToken}] User already exists: ${field}`);
      return res.status(409).json({
        success: false,
        message: `A user with this ${field} already exists.`,
        error: 'USER_EXISTS',
        field
      });
    }

    // Generate salt and hash the password with increased iterations
    const salt = crypto.randomBytes(32).toString('hex');
    const iterations = process.env.NODE_ENV === 'production' ? 100000 : 10000;
    const passwordHash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

    // Create a new user with the hashed password and salt
    const user = new User({
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      passwordHash: passwordHash,
      salt: salt,
      accountType: accountType || 'customer',
      profileInfo: profileInfo || {}
    });

    // Save the user to the database
    await user.save();

    // Create session (reuse sessionToken from line 59)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // 1 day expiration

    activeSessions.set(sessionToken, {
      userId: user._id,
      email: user.email,
      expiresAt: expiresAt.getTime(),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        accountType: user.accountType
      }
    });

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      profileInfo: user.profileInfo,
      status: user.status,
      createdAt: user.createdAt
    };

    console.log(`[${sessionToken}] User registered successfully: ${user._id}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: userResponse,
        sessionToken
      }
    });
  } catch (error) {
    console.error(`[${sessionToken}] Registration failed:`, error);
    res.status(500).json({
      success: false,
      message: 'Account creation failed. Please try again.',
      error: 'REGISTRATION_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const loginUser = async (req, res) => {
  const sessionToken = generateSessionToken();
  console.log(`[${sessionToken}] Login attempt started`);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log(`[${sessionToken}] Missing credentials`);
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        error: 'MISSING_CREDENTIALS'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: email.trim().toLowerCase() }
      ]
    });

    if (!user) {
      console.log(`[${sessionToken}] User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
        error: 'INVALID_CREDENTIALS'
      });
    }

    if (user.isLocked) {
      console.log(`[${sessionToken}] Account locked: ${user._id}`);
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to multiple failed attempts. Please try again later.',
        error: 'ACCOUNT_LOCKED',
        lockUntil: user.lockUntil
      });
    }

    const isValidPassword = await user.verifyPassword(password);

    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      console.log(`[${sessionToken}] Invalid password for user: ${user._id}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
        error: 'INVALID_CREDENTIALS'
      });
    }

    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      profileInfo: user.profileInfo,
      status: user.status,
      lastLogin: new Date()
    };

    console.log(`[${sessionToken}] Login successful: ${user._id}`);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: userResponse,
        sessionToken
      }
    });
  } catch (error) {
    console.error(`[${sessionToken}] Login failed:`, error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: 'LOGIN_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
