import express from 'express';
import {
  getNeighborhoods,
  getNeighborhoodById,
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
  addNeighborhoodReview,
  getNeighborhoodMatches,
  getMatchDetails,
  getCities,
  searchNeighborhoods
} from '../controllers/neighborhoodController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// Public routes
// @route   GET /api/neighborhoods
// @desc    Get all neighborhoods with filtering
// @access  Public
router.get('/', getNeighborhoods);

// @route   GET /api/neighborhoods/cities
// @desc    Get all cities with neighborhoods
// @access  Public
router.get('/cities', getCities);

// @route   GET /api/neighborhoods/search
// @desc    Search neighborhoods
// @access  Public
router.get('/search', searchNeighborhoods);

// Protected routes
// @route   GET /api/neighborhoods/matches
// @desc    Get neighborhood matches for user
// @access  Private
router.get('/matches', protect, getNeighborhoodMatches);

// @route   GET /api/neighborhoods/:id
// @desc    Get neighborhood by ID
// @access  Public
router.get('/:id', getNeighborhoodById);

// @route   GET /api/neighborhoods/:id/match-details
// @desc    Get detailed match analysis for specific neighborhood
// @access  Private
router.get('/:id/match-details', protect, getMatchDetails);

// @route   POST /api/neighborhoods
// @desc    Create new neighborhood (Admin only - for now, any authenticated user)
// @access  Private
router.post('/', protect, createNeighborhood);

// @route   PUT /api/neighborhoods/:id
// @desc    Update neighborhood (Admin only - for now, any authenticated user)
// @access  Private
router.put('/:id', protect, updateNeighborhood);

// @route   DELETE /api/neighborhoods/:id
// @desc    Delete neighborhood (Admin only - for now, any authenticated user)
// @access  Private
router.delete('/:id', protect, deleteNeighborhood);

// @route   POST /api/neighborhoods/:id/reviews
// @desc    Add review to neighborhood
// @access  Private
router.post('/:id/reviews', protect, addNeighborhoodReview);

export default router;