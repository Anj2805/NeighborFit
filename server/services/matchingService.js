import Neighborhood from '../models/neighborhoodModel.js';
import UserPreferences from '../models/userPreferencesModel.js';

/**
 * NeighborFit Matching Algorithm
 * Uses weighted scoring based on user preferences and neighborhood metrics
 */
class MatchingService {
  
  /**
   * Calculate compatibility score between user preferences and neighborhood
   * @param {Object} userPreferences - User's lifestyle preferences
   * @param {Object} neighborhood - Neighborhood data
   * @returns {Object} - Match score and breakdown
   */
  static calculateMatchScore(userPreferences, neighborhood) {
    const { lifestyle } = userPreferences;
    const { metrics } = neighborhood;
    
    // Weight factors for different lifestyle aspects
    const weights = {
      safety: 0.25,      // 25% - High priority for most users
      affordability: 0.20, // 20% - Important for budget considerations
      cleanliness: 0.15,   // 15% - Quality of life factor
      walkability: 0.15,   // 15% - Convenience and health
      transport: 0.15,     // 15% - Commute and accessibility
      nightlife: 0.10      // 10% - Lifestyle preference
    };
    
    let totalScore = 0;
    let breakdown = {};
    
    // Calculate weighted scores for each metric
    Object.keys(weights).forEach(metric => {
      const userImportance = lifestyle[metric] || 5; // Default to 5 if not specified
      const neighborhoodScore = metrics[metric] || 5;
      
      // Normalize scores (0-1 scale)
      const normalizedUserImportance = userImportance / 10;
      const normalizedNeighborhoodScore = neighborhoodScore / 10;
      
      // Calculate compatibility: how well neighborhood meets user's importance level
      const compatibility = 1 - Math.abs(normalizedUserImportance - normalizedNeighborhoodScore);
      
      // Apply weight and user importance multiplier
      const weightedScore = compatibility * weights[metric] * normalizedUserImportance;
      
      totalScore += weightedScore;
      breakdown[metric] = {
        userImportance,
        neighborhoodScore,
        compatibility: Math.round(compatibility * 100),
        weightedScore: Math.round(weightedScore * 100)
      };
    });
    
    // Convert to percentage and apply bonus factors
    let finalScore = Math.round(totalScore * 100);
    
    // Bonus for overall rating
    const ratingBonus = Math.round((neighborhood.overallRating - 3) * 2); // -4 to +4 points
    finalScore += ratingBonus;
    
    // Bonus for amenities match
    const amenitiesBonus = this.calculateAmenitiesBonus(userPreferences, neighborhood);
    finalScore += amenitiesBonus;
    
    // Ensure score is within 0-100 range
    finalScore = Math.max(0, Math.min(100, finalScore));
    
    return {
      score: finalScore,
      breakdown,
      bonuses: {
        rating: ratingBonus,
        amenities: amenitiesBonus
      }
    };
  }
  
  /**
   * Calculate bonus points based on amenities
   * @param {Object} userPreferences - User preferences
   * @param {Object} neighborhood - Neighborhood data
   * @returns {Number} - Bonus points (0-10)
   */
  static calculateAmenitiesBonus(userPreferences, neighborhood) {
    const { amenities } = neighborhood;
    let bonus = 0;
    
    // Bonus based on family status
    if (userPreferences.demographics?.familyStatus === 'family_with_kids') {
      bonus += Math.min(amenities.schools || 0, 3); // Max 3 points for schools
      bonus += Math.min(amenities.parks || 0, 2);   // Max 2 points for parks
    }
    
    // General amenities bonus
    const totalAmenities = Object.values(amenities).reduce((sum, count) => sum + (count || 0), 0);
    bonus += Math.min(Math.floor(totalAmenities / 5), 5); // Max 5 points for amenities
    
    return Math.min(bonus, 10); // Cap at 10 points
  }
  
  /**
   * Find matching neighborhoods for a user
   * @param {String} userId - User ID
   * @param {Object} filters - Additional filters (city, budget, etc.)
   * @returns {Array} - Sorted array of neighborhood matches
   */
  static async findMatches(userId, filters = {}) {
    try {
      // Get user preferences
      const userPreferences = await UserPreferences.findOne({ userId });
      if (!userPreferences) {
        throw new Error('User preferences not found. Please complete your profile first.');
      }
      
      // Build neighborhood query
      let query = {};
      
      // Filter by preferred cities
      if (userPreferences.location?.preferredCities?.length > 0) {
        query.city = { $in: userPreferences.location.preferredCities };
      }
      
      // Filter by budget (if housing data available)
      if (userPreferences.demographics?.budget) {
        const { min, max } = userPreferences.demographics.budget;
        query.$or = [
          { 'housing.averageRent1BHK': { $gte: min, $lte: max } },
          { 'housing.averageRent2BHK': { $gte: min, $lte: max } },
          { 'housing.averageRent3BHK': { $gte: min, $lte: max } }
        ];
      }
      
      // Apply additional filters
      if (filters.city) query.city = filters.city;
      if (filters.state) query.state = filters.state;
      
      // Get neighborhoods
      const neighborhoods = await Neighborhood.find(query);
      
      // Calculate match scores
      const matches = neighborhoods.map(neighborhood => {
        const matchResult = this.calculateMatchScore(userPreferences, neighborhood);
        
        return {
          neighborhood: neighborhood.toObject(),
          matchScore: matchResult.score,
          matchBreakdown: matchResult.breakdown,
          bonuses: matchResult.bonuses
        };
      });
      
      // Sort by match score (highest first)
      matches.sort((a, b) => b.matchScore - a.matchScore);
      
      return matches;
      
    } catch (error) {
      throw new Error(`Matching service error: ${error.message}`);
    }
  }
  
  /**
   * Get detailed match explanation
   * @param {String} userId - User ID
   * @param {String} neighborhoodId - Neighborhood ID
   * @returns {Object} - Detailed match analysis
   */
  static async getMatchDetails(userId, neighborhoodId) {
    try {
      const userPreferences = await UserPreferences.findOne({ userId });
      const neighborhood = await Neighborhood.findById(neighborhoodId);
      
      if (!userPreferences || !neighborhood) {
        throw new Error('User preferences or neighborhood not found');
      }
      
      const matchResult = this.calculateMatchScore(userPreferences, neighborhood);
      
      return {
        neighborhood: neighborhood.toObject(),
        userPreferences: userPreferences.toObject(),
        matchScore: matchResult.score,
        breakdown: matchResult.breakdown,
        bonuses: matchResult.bonuses,
        recommendations: this.generateRecommendations(userPreferences, neighborhood, matchResult)
      };
      
    } catch (error) {
      throw new Error(`Match details error: ${error.message}`);
    }
  }
  
  /**
   * Generate personalized recommendations
   * @param {Object} userPreferences - User preferences
   * @param {Object} neighborhood - Neighborhood data
   * @param {Object} matchResult - Match calculation result
   * @returns {Array} - Array of recommendation strings
   */
  static generateRecommendations(userPreferences, neighborhood, matchResult) {
    const recommendations = [];
    const { breakdown } = matchResult;
    
    // Analyze each metric and provide recommendations
    Object.entries(breakdown).forEach(([metric, data]) => {
      if (data.compatibility < 70) {
        switch (metric) {
          case 'safety':
            if (data.neighborhoodScore < data.userImportance) {
              recommendations.push(`Consider the safety measures in ${neighborhood.name}. Check local crime statistics and community safety initiatives.`);
            }
            break;
          case 'affordability':
            if (data.neighborhoodScore < data.userImportance) {
              recommendations.push(`${neighborhood.name} might be above your preferred budget. Consider nearby areas or adjust your budget expectations.`);
            }
            break;
          case 'transport':
            if (data.neighborhoodScore < data.userImportance) {
              recommendations.push(`Transportation options in ${neighborhood.name} may be limited. Check commute times to your workplace.`);
            }
            break;
        }
      }
    });
    
    // Positive recommendations for high-scoring areas
    if (matchResult.score >= 80) {
      recommendations.push(`${neighborhood.name} is an excellent match for your lifestyle preferences!`);
    } else if (matchResult.score >= 60) {
      recommendations.push(`${neighborhood.name} could be a good fit with some considerations.`);
    }
    
    return recommendations;
  }
}

export default MatchingService;