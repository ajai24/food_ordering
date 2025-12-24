import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 8
    },
    salt: {
      type: String,
      required: true
    },
    profileInfo: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      phone: { type: String, trim: true },
      avatar: { type: String }
    },
    accountType: {
      type: String,
      enum: ['customer', 'restaurant_admin', 'system_admin'],
      default: 'customer'
    },
    preferences: {
      dietaryRestrictions: [{ type: String }],
      favoriteCuisines: [{ type: String }],
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
      }
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }
  },
  { timestamps: true }
);

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', function generateSaltAndHash(next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  this.salt = crypto.randomBytes(32).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(this.passwordHash, this.salt, 10000, 64, 'sha512').toString('hex');
  next();
});

userSchema.methods.verifyPassword = function verifyPassword(candidatePassword) {
  const hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 10000, 64, 'sha512').toString('hex');
  return this.passwordHash === hash;
};

userSchema.methods.incrementLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1, loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { lockUntil: 1, loginAttempts: 1 },
    $set: { lastLogin: new Date() }
  });
};

export const User = mongoose.model('User', userSchema);
