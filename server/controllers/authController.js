// server/controllers/authController.js
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { emitNewUserRegistered } from '../services/realtimeService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, roles: ['user'] });
  const roles = user.roles?.length ? user.roles : (user.isAdmin ? ['admin'] : ['user']);
  emitNewUserRegistered({
    userId: user._id,
    name: user.name,
    email: user.email
  });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: roles.includes('admin'),
    roles,
    token: generateToken(user._id)
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    let roles = user.roles;
    if (!roles || roles.length === 0) {
      roles = user.isAdmin ? ['admin'] : ['user'];
      user.roles = roles;
    }
    user.lastActive = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: roles.includes('admin'),
      roles,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // For security, respond with success even if user doesn't exist
  if (!user) {
    return res.status(200).json({ message: "If an account with that email exists, we've sent reset instructions" });
  }

  // Generate a short-lived reset token
  const resetToken = jwt.sign({ id: user._id, type: 'reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email with resetToken link (production) and return token in non-production for easier testing
  try {
    const emailService = await import('../services/emailService.js');
    await emailService.sendResetPasswordEmail(user.email, resetToken);
  } catch (err) {
    console.error('Failed to send reset email:', err);
  }

  if (process.env.NODE_ENV === 'production') {
    res.status(200).json({ message: "If an account with that email exists, we've sent reset instructions" });
  } else {
    // For development we return token so it can be used directly in tests/dev
    res.status(200).json({ message: 'Reset instructions sent (for demo the token is returned)', resetToken });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) return res.status(400).json({ message: 'Missing token or password' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'reset') return res.status(400).json({ message: 'Invalid token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    if (!user.resetPasswordToken || user.resetPasswordToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};
