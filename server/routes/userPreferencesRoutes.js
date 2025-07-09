import express from 'express';
import {
  getUserPreferences,
  updateUserPreferences,
  deleteUserPreferences,
  getPreferencesStatus
} from '../controllers/userPreferencesController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/preferences
// @desc    Get user preferences
// @access  Private
router.get('/', getUserPreferences);

// @route   POST /api/preferences
// @desc    Create or update user preferences
// @access  Private
router.post('/', updateUserPreferences);

// @route   DELETE /api/preferences
// @desc    Delete user preferences
// @access  Private
router.delete('/', deleteUserPreferences);

// @route   GET /api/preferences/status
// @desc    Get preference completion status
// @access  Private
router.get('/status', getPreferencesStatus);

export default router;