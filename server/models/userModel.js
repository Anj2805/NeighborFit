// server/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin', 'support'],
    default: ['user']
  },
  isAdmin: { type: Boolean, default: false }, // legacy flag for compatibility
  familyStatus: {
    type: String,
    enum: ['single', 'couple', 'family_with_kids', 'retired', null],
    default: null
  },
  city: { type: String, default: null },
  lastActive: { type: Date, default: null },
  softDeleted: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.hasRole = function (role) {
  return this.roles?.includes(role) || (role === 'admin' && this.isAdmin);
};

export default mongoose.model('User', userSchema);
