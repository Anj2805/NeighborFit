import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Neighborhood from '../models/neighborhoodModel.js';
import UserPreferences from '../models/userPreferencesModel.js';
import AdminActivityLog from '../models/adminActivityLogModel.js';
import AnalyticsCache from '../models/analyticsCacheModel.js';

const rangeMap = {
  '7d': 7,
  '30d': 30,
  '90d': 90
};

const parseRange = (range = '7d') => {
  if (typeof range !== 'string') return 7;
  return rangeMap[range] || 7;
};

const cacheResult = async (key, ttlSeconds, generator) => {
  const now = new Date();
  const cached = await AnalyticsCache.findOne({ key, expiresAt: { $gt: now } });
  if (cached) return cached.payload;

  const payload = await generator();
  await AnalyticsCache.findOneAndUpdate(
    { key },
    {
      payload,
      ttl: ttlSeconds,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000)
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return payload;
};

const buildDailyBuckets = (days) => {
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    buckets.push({
      date,
      formatted: date.toISOString().split('T')[0],
      count: 0
    });
  }
  return buckets;
};

export const getDashboardStats = async (range = '7d') => {
  const days = parseRange(range);
  const cacheKey = `dashboard:${days}`;
  return cacheResult(cacheKey, 60, async () => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const rangeStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      activeUsers,
      totalNeighborhoods,
      totalReviewsAgg,
      recentActivity
    ] = await Promise.all([
      User.countDocuments({ softDeleted: false }),
      User.countDocuments({ createdAt: { $gte: startOfDay }, softDeleted: false }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, softDeleted: false }),
      User.countDocuments({ createdAt: { $gte: monthAgo }, softDeleted: false }),
      User.countDocuments({ lastActive: { $gte: rangeStart }, suspended: false, softDeleted: false }),
      Neighborhood.countDocuments({}),
      Neighborhood.aggregate([
        { $project: { reviewCount: { $size: '$reviews' } } },
        { $group: { _id: null, total: { $sum: '$reviewCount' } } }
      ]),
      AdminActivityLog.find({ createdAt: { $gte: sevenDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
    ]);

    const heatmapAgg = await AdminActivityLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $project: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          hour: { $hour: '$createdAt' }
        }
      },
      { $group: { _id: { day: '$day', hour: '$hour' }, count: { $sum: 1 } } }
    ]);

    const heatmap = heatmapAgg.map(entry => ({
      day: entry._id.day,
      hour: entry._id.hour,
      count: entry.count
    }));

    return {
      totals: {
        users: totalUsers,
        neighborhoods: totalNeighborhoods,
        reviews: totalReviewsAgg[0]?.total || 0
      },
      newUsers: {
        today: newUsersToday,
        week: newUsersWeek,
        month: newUsersMonth
      },
      activeUsers,
      recentActivity,
      heatmap
    };
  });
};

export const getUserAnalytics = async (range = '30d') => {
  const days = parseRange(range);
  const cacheKey = `userAnalytics:${days}`;
  return cacheResult(cacheKey, 120, async () => {
    const rangeStart = new Date();
    rangeStart.setHours(0, 0, 0, 0);
    rangeStart.setDate(rangeStart.getDate() - (days - 1));

    const dailyAgg = await User.aggregate([
      { $match: { createdAt: { $gte: rangeStart }, softDeleted: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      }
    ]);

    const buckets = buildDailyBuckets(days);
    const bucketMap = Object.fromEntries(buckets.map(b => [b.formatted, b]));
    dailyAgg.forEach(day => {
      if (bucketMap[day._id]) {
        bucketMap[day._id].count = day.count;
      }
    });

    const familyStatus = await User.aggregate([
      { $match: { softDeleted: false, familyStatus: { $ne: null } } },
      { $group: { _id: '$familyStatus', count: { $sum: 1 } } }
    ]);

    const preferenceAges = await UserPreferences.aggregate([
      { $match: { 'demographics.age': { $exists: true } } },
      {
        $project: {
          ageBucket: {
            $switch: {
              branches: [
                { case: { $lt: ['$demographics.age', 25] }, then: '18-24' },
                { case: { $lt: ['$demographics.age', 35] }, then: '25-34' },
                { case: { $lt: ['$demographics.age', 45] }, then: '35-44' },
                { case: { $lt: ['$demographics.age', 60] }, then: '45-59' }
              ],
              default: '60+'
            }
          }
        }
      },
      { $group: { _id: '$ageBucket', count: { $sum: 1 } } }
    ]);

    return {
      dailyCounts: buckets.map(b => ({ date: b.formatted, count: b.count })),
      demographics: {
        familyStatus,
        ageBuckets: preferenceAges
      }
    };
  });
};

export const getNeighborhoodAnalytics = async (range = '30d') => {
  const days = parseRange(range);
  const cacheKey = `neighborhoodAnalytics:${days}`;
  return cacheResult(cacheKey, 120, async () => {
    const cityDistribution = await Neighborhood.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 }, avgRating: { $avg: '$overallRating' } } },
      { $sort: { count: -1 } }
    ]);

    const topRated = await Neighborhood.find({})
      .sort({ overallRating: -1 })
      .limit(5)
      .select('name city overallRating matchSuccessRate sentimentScore')
      .lean();

    const trendRangeStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const popularityTrend = await Neighborhood.aggregate([
      { $match: { updatedAt: { $gte: trendRangeStart } } },
      {
        $project: {
          name: 1,
          city: 1,
          viewCount: 1,
          matchSuccessRate: 1,
          sentimentScore: 1,
          updatedDay: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }
        }
      },
      {
        $group: {
          _id: '$updatedDay',
          avgMatch: { $avg: '$matchSuccessRate' },
          avgSentiment: { $avg: '$sentimentScore' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const viewTrend = await Neighborhood.aggregate([
      { $match: { updatedAt: { $gte: trendRangeStart } } },
      {
        $project: {
          viewCount: 1,
          matchSuccessRate: 1,
          updatedDay: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }
        }
      },
      {
        $group: {
          _id: '$updatedDay',
          avgViews: { $avg: '$viewCount' },
          avgMatch: { $avg: '$matchSuccessRate' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const matchSuccessDistribution = await Neighborhood.aggregate([
      {
        $bucket: {
          groupBy: {
            $cond: {
              if: { $gte: ['$matchSuccessRate', 0] },
              then: '$matchSuccessRate',
              else: 0
            }
          },
          boundaries: [0, 40, 60, 80, 101],
          default: 'unknown',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    const comparison = await Neighborhood.aggregate([
      {
        $group: {
          _id: '$city',
          avgMatch: { $avg: '$matchSuccessRate' },
          avgSentiment: { $avg: '$sentimentScore' },
          totalViews: { $sum: '$viewCount' },
          neighborhoods: { $sum: 1 }
        }
      },
      { $sort: { avgMatch: -1 } },
      { $limit: 5 }
    ]);

    return {
      cityDistribution,
      topRated,
      popularityTrend,
      viewTrend,
      matchSuccessDistribution,
      comparison
    };
  });
};

export const getActivityHeatmap = async (days = 7) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return AdminActivityLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          hour: { $hour: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.day': 1, '_id.hour': 1 } }
  ]);
};
