import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Neighborhood from '../models/neighborhoodModel.js';
import AdminActivityLog from '../models/adminActivityLogModel.js';
import UserPreferences from '../models/userPreferencesModel.js';
import { Parser } from 'json2csv';
import {
  emitAdminActionEvent,
  emitNeighborhoodUpdated,
  emitSystemAlert
} from './realtimeService.js';

const parseCsvString = (raw) => {
  const lines = raw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] ?? '';
    });
    return record;
  });
};

export const recordAdminAction = async ({ adminId, action, entityType, entityId, metadata, req }) => {
  const log = await AdminActivityLog.create({
    adminId,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress: req?.ip
  });
  emitAdminActionEvent({
    adminId,
    action,
    entityType,
    entityId,
    metadata
  });
  return log;
};

export const getActivityLog = async ({ page = 1, limit = 25, action, adminId }) => {
  const query = {};
  if (action) query.action = action;
  if (adminId) query.adminId = adminId;

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    AdminActivityLog.find(query)
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AdminActivityLog.countDocuments(query)
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const bulkUserAction = async ({ action, userIds, payload = {}, actorId, req }) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('userIds array is required');
  }

  let result;
  switch (action) {
    case 'suspend':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { suspended: true } }
      );
      break;
    case 'activate':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { suspended: false } }
      );
      break;
    case 'softDelete':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { softDeleted: true, suspended: true } }
      );
      break;
    case 'restore':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { softDeleted: false } }
      );
      break;
    case 'setAdmin':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { roles: 'admin' }, $set: { isAdmin: true } }
      );
      break;
    case 'removeAdmin':
      result = await User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { roles: 'admin' }, $set: { isAdmin: false } }
      );
      break;
    default:
      throw new Error(`Unsupported bulk action: ${action}`);
  }

  await recordAdminAction({
    adminId: actorId,
    action: `users.${action}`,
    entityType: 'user',
    entityId: userIds.join(','),
    metadata: { payload, processed: result.modifiedCount },
    req
  });

  return {
    success: true,
    processed: result.modifiedCount,
    matched: result.matchedCount
  };
};

export const getUserDetail = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw new Error('User not found');

  const preferences = await UserPreferences.findOne({ userId }).lean();
  const reviews = await Neighborhood.aggregate([
    { $match: { 'reviews.userId': user._id } },
    { $unwind: '$reviews' },
    { $match: { 'reviews.userId': user._id } },
    {
      $project: {
        neighborhood: '$name',
        city: '$city',
        rating: '$reviews.rating',
        comment: '$reviews.comment',
        createdAt: '$reviews.createdAt'
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return {
    user,
    preferences,
    reviews
  };
};

export const importNeighborhoodsFromCsv = async ({ fileBuffer, actorId, req }) => {
  const content = fileBuffer.toString('utf-8');
  const rows = parseCsvString(content);
  if (rows.length === 0) {
    throw new Error('CSV file has no records');
  }

  const documents = rows.map(row => ({
    name: row.name,
    city: row.city,
    state: row.state || 'Unknown',
    country: row.country || 'India',
    metrics: {
      safety: Number(row.safety || 5),
      affordability: Number(row.affordability || 5),
      cleanliness: Number(row.cleanliness || 5),
      walkability: Number(row.walkability || 5),
      nightlife: Number(row.nightlife || 5),
      transport: Number(row.transport || 5)
    },
    amenities: {
      schools: Number(row.schools || 0),
      hospitals: Number(row.hospitals || 0),
      parks: Number(row.parks || 0),
      restaurants: Number(row.restaurants || 0),
      shoppingCenters: Number(row.shoppingCenters || 0),
      gyms: Number(row.gyms || 0)
    },
    housing: {
      averageRent1BHK: Number(row.averageRent1BHK || 0),
      averageRent2BHK: Number(row.averageRent2BHK || 0),
      averageRent3BHK: Number(row.averageRent3BHK || 0),
      averagePropertyPrice: Number(row.averagePropertyPrice || 0)
    },
    overallRating: Number(row.overallRating || 3),
    imageUrl: row.imageUrl || null,
    images: row.images ? row.images.split('|') : [],
    viewCount: Number(row.viewCount || 0),
    matchSuccessRate: Number(row.matchSuccessRate || 0),
    sentimentScore: Number(row.sentimentScore || 0)
  }));

  const inserted = await Neighborhood.insertMany(documents, { ordered: false }).catch(error => {
    if (error.writeErrors) {
      return { acknowledged: true, insertedCount: error.result.nInserted };
    }
    throw error;
  });

  await recordAdminAction({
    adminId: actorId,
    action: 'neighborhoods.import',
    entityType: 'neighborhood',
    metadata: { count: inserted.insertedCount || documents.length },
    req
  });
  emitNeighborhoodUpdated({
    action: 'imported',
    adminId: actorId,
    count: inserted.insertedCount || documents.length
  });

  return {
    success: true,
    inserted: inserted.insertedCount || documents.length
  };
};

export const exportUsersCsv = async ({ filter = {} }) => {
  const users = await User.find(filter)
    .select('name email roles city familyStatus lastActive createdAt suspended softDeleted')
    .lean();

  const parser = new Parser({
    fields: [
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Roles', value: row => row.roles?.join('|') || '' },
      { label: 'City', value: 'city' },
      { label: 'Family Status', value: 'familyStatus' },
      { label: 'Last Active', value: row => row.lastActive ? new Date(row.lastActive).toISOString() : '' },
      { label: 'Created At', value: row => row.createdAt?.toISOString?.() || '' },
      { label: 'Suspended', value: row => row.suspended ? 'Yes' : 'No' },
      { label: 'Soft Deleted', value: row => row.softDeleted ? 'Yes' : 'No' }
    ]
  });

  const csv = parser.parse(users);
  return Buffer.from(csv, 'utf-8');
};

export const getSystemHealth = async () => {
  const mongoState = mongoose.connection.readyState;
  return {
    uptime: process.uptime(),
    dbStatus: mongoState === 1 ? 'connected' : 'disconnected',
    memoryUsage: process.memoryUsage(),
    timestamp: new Date()
  };
};

export const triggerBackup = async ({ actorId, req }) => {
  const jobId = `backup_${Date.now()}`;
  await recordAdminAction({
    adminId: actorId,
    action: 'system.backup',
    entityType: 'system',
    entityId: jobId,
    metadata: { status: 'queued' },
    req
  });
  emitSystemAlert({
    severity: 'info',
    message: 'Backup job queued',
    jobId
  });
  return { jobId, status: 'queued' };
};
