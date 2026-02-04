import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

let ioInstance = null;
let adminNamespace = null;
let userNamespace = null;
let liveUserInterval = null;

const DEFAULT_ACTIVE_WINDOW_MINUTES = 15;

const withTimestamp = (payload = {}) => ({
  ...payload,
  timestamp: payload.timestamp || new Date().toISOString()
});

export const initRealtime = (httpServer, options = {}) => {
  if (!httpServer) {
    throw new Error('HTTP server instance is required to initialize realtime layer');
  }

  ioInstance = new Server(httpServer, {
    cors: options.cors || { origin: '*', credentials: true }
  });

  adminNamespace = ioInstance.of('/admin');
  adminNamespace.on('connection', (socket) => {
    socket.emit('connected', { id: socket.id, timestamp: new Date().toISOString() });
    socket.on('disconnect', () => {
      // no-op; reserved for future monitoring
    });
  });

  userNamespace = ioInstance.of('/users');
  userNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.join(decoded.id.toString());
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });
  userNamespace.on('connection', (socket) => {
    socket.emit('connected', { id: socket.id, timestamp: new Date().toISOString() });
  });

  return ioInstance;
};

const emitToAdmin = (event, payload) => {
  if (adminNamespace) {
    adminNamespace.emit(event, withTimestamp(payload));
  }
};

export const emitNewUserRegistered = (payload) =>
  emitToAdmin('new_user_registered', payload);

export const emitNeighborhoodUpdated = (payload) =>
  emitToAdmin('neighborhood_updated', payload);

export const emitAdminActionEvent = (payload) =>
  emitToAdmin('admin_action_performed', payload);

export const emitSystemAlert = (payload) =>
  emitToAdmin('system_alert', payload);

export const emitLiveUserCount = (count) =>
  emitToAdmin('live_user_count', { count });

export const emitUserInsightsUpdate = (userId, payload = {}) => {
  if (userNamespace && userId) {
    userNamespace.to(userId.toString()).emit('insights_updated', withTimestamp(payload));
  }
};

const computeLiveUserCount = async () => {
  const cutoff = new Date(Date.now() - DEFAULT_ACTIVE_WINDOW_MINUTES * 60 * 1000);
  const count = await User.countDocuments({
    softDeleted: false,
    suspended: false,
    lastActive: { $gte: cutoff }
  });
  emitLiveUserCount(count);
  return count;
};

export const startRealtimeLoops = ({ liveUserIntervalMs = 30_000 } = {}) => {
  if (liveUserInterval) {
    clearInterval(liveUserInterval);
  }

  const run = async () => {
    try {
      await computeLiveUserCount();
    } catch (error) {
      console.error('Failed to broadcast live user count:', error.message);
    }
  };

  run();
  liveUserInterval = setInterval(run, liveUserIntervalMs);
};
