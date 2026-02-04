import express from 'express';
import { protect, requireAdmin } from '../middleware/protect.js';
import {
  getDashboardStatsController,
  getUserAnalyticsController,
  getNeighborhoodAnalyticsController,
  getActivityLogController,
  bulkUserActionController,
  getUserDetailController,
  importNeighborhoodsController,
  exportUsersController,
  getSystemHealthController,
  triggerBackupController
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard-stats', requireAdmin('admin'), getDashboardStatsController);
router.get('/user-analytics', requireAdmin('admin'), getUserAnalyticsController);
router.get('/neighborhood-analytics', requireAdmin('admin'), getNeighborhoodAnalyticsController);
router.get('/activity-log', requireAdmin('support'), getActivityLogController);

router.post('/users/bulk-actions', requireAdmin('admin'), bulkUserActionController);
router.get('/users/export', requireAdmin('admin'), exportUsersController);
router.get('/users/:userId', requireAdmin('support'), getUserDetailController);

router.post('/neighborhoods/import', requireAdmin('admin'), importNeighborhoodsController);

router.get('/system-health', requireAdmin('super'), getSystemHealthController);
router.post('/backup', requireAdmin('super'), triggerBackupController);

export default router;
