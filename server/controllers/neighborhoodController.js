import Neighborhood from '../models/neighborhoodModel.js';
import MatchingService from '../services/matchingService.js';

/**
 * Get all neighborhoods with optional filtering
 * @route GET /api/neighborhoods
 * @access Public
 */
export const getNeighborhoods = async (req, res) => {
  try {
    const { city, state, page = 1, limit = 10, sortBy = 'name' } = req.query;
    
    // Build query
    let query = {};
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get neighborhoods with pagination
    const neighborhoods = await Neighborhood.find(query)
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews.userId', 'name');
    
    // Get total count for pagination
    const total = await Neighborhood.countDocuments(query);
    
    res.json({
      neighborhoods,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get neighborhood by ID
 * @route GET /api/neighborhoods/:id
 * @access Public
 */
export const getNeighborhoodById = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id)
      .populate('reviews.userId', 'name');
    
    if (!neighborhood) {
      return res.status(404).json({ message: 'Neighborhood not found' });
    }
    
    res.json(neighborhood);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid neighborhood ID' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create new neighborhood (Admin only)
 * @route POST /api/neighborhoods
 * @access Private/Admin
 */
export const createNeighborhood = async (req, res) => {
  try {
    const neighborhoodData = req.body;
    
    // Check if neighborhood already exists
    const existingNeighborhood = await Neighborhood.findOne({ 
      name: neighborhoodData.name,
      city: neighborhoodData.city 
    });
    
    if (existingNeighborhood) {
      return res.status(400).json({ 
        message: 'Neighborhood already exists in this city' 
      });
    }
    
    const neighborhood = new Neighborhood(neighborhoodData);
    await neighborhood.save();
    
    res.status(201).json({
      message: 'Neighborhood created successfully',
      neighborhood
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update neighborhood (Admin only)
 * @route PUT /api/neighborhoods/:id
 * @access Private/Admin
 */
export const updateNeighborhood = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);
    
    if (!neighborhood) {
      return res.status(404).json({ message: 'Neighborhood not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        neighborhood[key] = req.body[key];
      }
    });
    
    neighborhood.lastUpdated = new Date();
    await neighborhood.save();
    
    res.json({
      message: 'Neighborhood updated successfully',
      neighborhood
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete neighborhood (Admin only)
 * @route DELETE /api/neighborhoods/:id
 * @access Private/Admin
 */
export const deleteNeighborhood = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);
    
    if (!neighborhood) {
      return res.status(404).json({ message: 'Neighborhood not found' });
    }
    
    await neighborhood.deleteOne();
    
    res.json({ message: 'Neighborhood deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add review to neighborhood
 * @route POST /api/neighborhoods/:id/reviews
 * @access Private
 */
export const addNeighborhoodReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    const neighborhood = await Neighborhood.findById(req.params.id);
    
    if (!neighborhood) {
      return res.status(404).json({ message: 'Neighborhood not found' });
    }
    
    // Check if user already reviewed this neighborhood
    const existingReview = neighborhood.reviews.find(
      review => review.userId.toString() === req.user._id.toString()
    );
    
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this neighborhood' 
      });
    }
    
    // Add new review
    neighborhood.reviews.push({
      userId: req.user._id,
      rating,
      comment: comment || ''
    });
    
    // Recalculate overall rating
    neighborhood.calculateOverallRating();
    
    await neighborhood.save();
    
    // Populate the new review for response
    await neighborhood.populate('reviews.userId', 'name');
    
    res.status(201).json({
      message: 'Review added successfully',
      review: neighborhood.reviews[neighborhood.reviews.length - 1],
      overallRating: neighborhood.overallRating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get neighborhood matches for user
 * @route GET /api/neighborhoods/matches
 * @access Private
 */
export const getNeighborhoodMatches = async (req, res) => {
  try {
    const { city, state, limit = 20 } = req.query;
    
    const filters = {};
    if (city) filters.city = city;
    if (state) filters.state = state;
    
    const matches = await MatchingService.findMatches(req.user._id, filters);
    
    // Limit results
    const limitedMatches = matches.slice(0, parseInt(limit));
    
    res.json({
      matches: limitedMatches,
      totalFound: matches.length
    });
  } catch (error) {
    if (error.message.includes('User preferences not found')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get detailed match analysis for specific neighborhood
 * @route GET /api/neighborhoods/:id/match-details
 * @access Private
 */
export const getMatchDetails = async (req, res) => {
  try {
    const matchDetails = await MatchingService.getMatchDetails(
      req.user._id, 
      req.params.id
    );
    
    res.json(matchDetails);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get cities with neighborhoods
 * @route GET /api/neighborhoods/cities
 * @access Public
 */
export const getCities = async (req, res) => {
  try {
    const cities = await Neighborhood.distinct('city');
    const citiesWithStates = await Neighborhood.aggregate([
      {
        $group: {
          _id: '$city',
          state: { $first: '$state' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          city: '$_id',
          state: 1,
          neighborhoodCount: '$count',
          _id: 0
        }
      },
      {
        $sort: { city: 1 }
      }
    ]);
    
    res.json(citiesWithStates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search neighborhoods
 * @route GET /api/neighborhoods/search
 * @access Public
 */
export const searchNeighborhoods = async (req, res) => {
  try {
    const { q, city, state, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Build search query
    let query = {
      $or: [
        { name: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') },
        { state: new RegExp(q, 'i') }
      ]
    };
    
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    
    const neighborhoods = await Neighborhood.find(query)
      .limit(parseInt(limit))
      .select('name city state metrics overallRating')
      .sort({ overallRating: -1, name: 1 });
    
    res.json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};