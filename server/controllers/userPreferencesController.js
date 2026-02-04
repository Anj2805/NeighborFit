import UserPreferences from '../models/userPreferencesModel.js';
import { emitUserInsightsUpdate } from '../services/realtimeService.js';

/**
 * Get user preferences
 * @route GET /api/preferences
 * @access Private
 */
export const getUserPreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      return res.status(404).json({ 
        message: 'User preferences not found. Please complete your profile first.' 
      });
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create or update user preferences
 * @route POST /api/preferences
 * @access Private
 */
export const updateUserPreferences = async (req, res) => {
  try {
    const { lifestyle, demographics, location } = req.body;
    
    // Validate lifestyle preferences (1-10 scale)
    if (lifestyle) {
      const lifestyleKeys = ['safety', 'affordability', 'cleanliness', 'walkability', 'nightlife', 'transport'];
      for (const key of lifestyleKeys) {
        if (lifestyle[key] && (lifestyle[key] < 1 || lifestyle[key] > 10)) {
          return res.status(400).json({ 
            message: `${key} preference must be between 1 and 10` 
          });
        }
      }
    }
    
    // Validate demographics
    if (demographics) {
      if (demographics.age && (demographics.age < 18 || demographics.age > 100)) {
        return res.status(400).json({ 
          message: 'Age must be between 18 and 100' 
        });
      }
      
      if (demographics.familyStatus && 
          !['single', 'couple', 'family_with_kids', 'retired'].includes(demographics.familyStatus)) {
        return res.status(400).json({ 
          message: 'Invalid family status' 
        });
      }
      
      if (demographics.budget && demographics.budget.min > demographics.budget.max) {
        return res.status(400).json({ 
          message: 'Minimum budget cannot be greater than maximum budget' 
        });
      }
    }
    
    // Find existing preferences or create new
    let preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (preferences) {
      // Update existing preferences
      if (lifestyle) preferences.lifestyle = { ...preferences.lifestyle, ...lifestyle };
      if (demographics) preferences.demographics = { ...preferences.demographics, ...demographics };
      if (location) preferences.location = { ...preferences.location, ...location };
      
      await preferences.save();
    } else {
      // Create new preferences
      preferences = new UserPreferences({
        userId: req.user._id,
        lifestyle: lifestyle || {},
        demographics: demographics || {},
        location: location || {}
      });
      
      await preferences.save();
    }
    
    res.json({
      message: 'Preferences updated successfully',
      preferences
    });
    emitUserInsightsUpdate(req.user._id, { reason: 'preferences.updated' });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete user preferences
 * @route DELETE /api/preferences
 * @access Private
 */
export const deleteUserPreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOneAndDelete({ userId: req.user._id });
    
    if (!preferences) {
      return res.status(404).json({ message: 'User preferences not found' });
    }
    
    res.json({ message: 'Preferences deleted successfully' });
    emitUserInsightsUpdate(req.user._id, { reason: 'preferences.deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get preference completion status
 * @route GET /api/preferences/status
 * @access Private
 */
export const getPreferencesStatus = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.user._id });
    
    if (!preferences) {
      return res.json({
        completed: false,
        completionPercentage: 0,
        missingFields: ['lifestyle', 'demographics', 'location']
      });
    }
    
    // Calculate completion percentage
    let completedFields = 0;
    let totalFields = 0;
    const missingFields = [];
    
    // Check lifestyle preferences
    const lifestyleKeys = ['safety', 'affordability', 'cleanliness', 'walkability', 'nightlife', 'transport'];
    lifestyleKeys.forEach(key => {
      totalFields++;
      if (preferences.lifestyle[key]) {
        completedFields++;
      } else {
        missingFields.push(`lifestyle.${key}`);
      }
    });
    
    // Check demographics
    const demographicsKeys = ['age', 'occupation', 'familyStatus'];
    demographicsKeys.forEach(key => {
      totalFields++;
      if (preferences.demographics[key]) {
        completedFields++;
      } else {
        missingFields.push(`demographics.${key}`);
      }
    });
    
    // Check location
    const locationKeys = ['currentCity', 'preferredCities'];
    locationKeys.forEach(key => {
      totalFields++;
      if (preferences.location[key] && 
          (Array.isArray(preferences.location[key]) ? preferences.location[key].length > 0 : true)) {
        completedFields++;
      } else {
        missingFields.push(`location.${key}`);
      }
    });
    
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    const completed = completionPercentage >= 80; // Consider 80% as completed
    
    res.json({
      completed,
      completionPercentage,
      missingFields: completed ? [] : missingFields
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
