import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const LAST_ACTIVE_UPDATE_WINDOW_MS = 5 * 60 * 1000;

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    if (
      !req.user.lastActive ||
      Date.now() - new Date(req.user.lastActive).getTime() > LAST_ACTIVE_UPDATE_WINDOW_MS
    ) {
      req.user.lastActive = new Date();
      await req.user.save({ validateBeforeSave: false });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const hasRole = (user, role) => {
  if (!user) return false;
  const roles = user.roles || [];
  if (role === 'admin') return roles.includes('admin') || roles.includes('super_admin') || user.isAdmin;
  if (role === 'super') return roles.includes('super_admin');
  if (role === 'support') return roles.includes('support') || roles.includes('admin') || roles.includes('super_admin');
  return roles.includes(role);
};

export const admin = (req, res, next) => {
  if (hasRole(req.user, 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export const requireAdmin = (level = 'admin') => (req, res, next) => {
  const levelMap = {
    support: hasRole(req.user, 'support'),
    admin: hasRole(req.user, 'admin'),
    super: hasRole(req.user, 'super')
  };

  const allowed = level === 'support' ? levelMap.support : level === 'super' ? levelMap.super : levelMap.admin;

  if (!allowed) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  next();
};
