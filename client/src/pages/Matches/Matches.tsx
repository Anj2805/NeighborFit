import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import './Matches.css';

interface Match {
  neighborhood: {
    _id: string;
    name: string;
    city: string;
    state: string;
    metrics: {
      safety: number;
      affordability: number;
      cleanliness: number;
      walkability: number;
      nightlife: number;
      transport: number;
    };
    overallRating: number;
    amenities: {
      schools: number;
      hospitals: number;
      parks: number;
      restaurants: number;
      shoppingCenters: number;
      gyms: number;
    };
    housing?: {
      averageRent1BHK?: number;
      averageRent2BHK?: number;
      averageRent3BHK?: number;
    };
  };
  matchScore: number;
  matchBreakdown: {
    [key: string]: {
      userImportance: number;
      neighborhoodScore: number;
      compatibility: number;
      weightedScore: number;
    };
  };
  bonuses: {
    rating: number;
    amenities: number;
  };
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    minScore: 0,
    city: '',
    sortBy: 'score'
  });
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [matches, filters]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/neighborhoods/matches');
      setMatches(response.data);
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      if (err.response?.status === 404) {
        setError('Please complete your preferences first to see personalized matches.');
      } else {
        setError('Failed to load matches. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = matches.filter(match => {
      const meetsMinScore = match.matchScore >= filters.minScore;
      const meetsCity = !filters.city || match.neighborhood.city === filters.city;
      return meetsMinScore && meetsCity;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'score':
          return b.matchScore - a.matchScore;
        case 'name':
          return a.neighborhood.name.localeCompare(b.neighborhood.name);
        case 'city':
          return a.neighborhood.city.localeCompare(b.neighborhood.city);
        case 'rating':
          return b.neighborhood.overallRating - a.neighborhood.overallRating;
        default:
          return 0;
      }
    });

    setFilteredMatches(filtered);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return '#48bb78'; // Green
    if (score >= 60) return '#ed8936'; // Orange
    if (score >= 40) return '#ecc94b'; // Yellow
    return '#f56565'; // Red
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  const getMetricColor = (value: number) => {
    if (value >= 8) return '#48bb78';
    if (value >= 6) return '#ed8936';
    return '#f56565';
  };

  const cities = [...new Set(matches.map(match => match.neighborhood.city))].sort();

  if (loading) {
    return (
      <div className="matches-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding your perfect neighborhood matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="matches-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">🎯</div>
            <h2>No Matches Found</h2>
            <p>{error}</p>
            <div className="error-actions">
              <Link to="/preferences" className="btn btn-primary">
                Set Your Preferences
              </Link>
              <Link to="/neighborhoods" className="btn btn-outline">
                Explore All Neighborhoods
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="matches-page">
      <div className="container">
        {/* Header */}
        <div className="matches-header">
          <div className="header-content">
            <h1>Your Neighborhood Matches</h1>
            <p>Personalized recommendations based on your lifestyle preferences</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <div className="stat-number">{matches.length}</div>
              <div className="stat-label">Total Matches</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                {matches.length > 0 ? Math.round(matches[0].matchScore) : 0}%
              </div>
              <div className="stat-label">Best Match</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="matches-filters">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Minimum Match Score</label>
              <select
                value={filters.minScore}
                onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                className="filter-select"
              >
                <option value={0}>All Matches</option>
                <option value={40}>40%+ (Fair Match)</option>
                <option value={60}>60%+ (Good Match)</option>
                <option value={80}>80%+ (Excellent Match)</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="filter-select"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="filter-select"
              >
                <option value="score">Match Score</option>
                <option value="name">Name</option>
                <option value="city">City</option>
                <option value="rating">Overall Rating</option>
              </select>
            </div>

            <div className="filter-actions">
              <Link to="/preferences" className="btn btn-outline">
                Update Preferences
              </Link>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing {filteredMatches.length} of {matches.length} matches
            {filters.minScore > 0 && ` with ${filters.minScore}%+ match score`}
            {filters.city && ` in ${filters.city}`}
          </p>
        </div>

        {/* Matches List */}
        <div className="matches-list">
          {filteredMatches.map((match, index) => (
            <div key={match.neighborhood._id} className="match-card">
              <div className="match-header">
                <div className="match-rank">#{index + 1}</div>
                <div className="match-info">
                  <h3 className="neighborhood-name">{match.neighborhood.name}</h3>
                  <div className="neighborhood-location">
                    📍 {match.neighborhood.city}, {match.neighborhood.state}
                  </div>
                  <div className="neighborhood-rating">
                    ⭐ {match.neighborhood.overallRating.toFixed(1)}
                  </div>
                </div>
                <div className="match-score-container">
                  <div 
                    className="match-score"
                    style={{ color: getMatchScoreColor(match.matchScore) }}
                  >
                    {match.matchScore}%
                  </div>
                  <div className="match-label">
                    {getMatchScoreLabel(match.matchScore)}
                  </div>
                </div>
              </div>

              <div className="match-content">
                {/* Metrics Breakdown */}
                <div className="metrics-section">
                  <h4>Lifestyle Metrics</h4>
                  <div className="metrics-grid">
                    {Object.entries(match.matchBreakdown).map(([metric, data]) => (
                      <div key={metric} className="metric-item">
                        <div className="metric-header">
                          <span className="metric-name">
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </span>
                          <span className="compatibility-score">
                            {data.compatibility}%
                          </span>
                        </div>
                        <div className="metric-details">
                          <div className="metric-bar">
                            <div 
                              className="metric-fill" 
                              style={{ 
                                width: `${data.neighborhoodScore * 10}%`,
                                backgroundColor: getMetricColor(data.neighborhoodScore)
                              }}
                            ></div>
                          </div>
                          <div className="metric-values">
                            <span>Your priority: {data.userImportance}/10</span>
                            <span>Area score: {data.neighborhoodScore}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Housing Information */}
                {match.neighborhood.housing && (
                  <div className="housing-section">
                    <h4>Rental Prices</h4>
                    <div className="rent-prices">
                      {match.neighborhood.housing.averageRent1BHK && (
                        <div className="rent-item">
                          <span className="rent-type">1BHK</span>
                          <span className="rent-price">₹{match.neighborhood.housing.averageRent1BHK.toLocaleString()}</span>
                        </div>
                      )}
                      {match.neighborhood.housing.averageRent2BHK && (
                        <div className="rent-item">
                          <span className="rent-type">2BHK</span>
                          <span className="rent-price">₹{match.neighborhood.housing.averageRent2BHK.toLocaleString()}</span>
                        </div>
                      )}
                      {match.neighborhood.housing.averageRent3BHK && (
                        <div className="rent-item">
                          <span className="rent-type">3BHK</span>
                          <span className="rent-price">₹{match.neighborhood.housing.averageRent3BHK.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities Summary */}
                <div className="amenities-section">
                  <h4>Key Amenities</h4>
                  <div className="amenities-list">
                    {Object.entries(match.neighborhood.amenities)
                      .filter(([_, count]) => count > 0)
                      .slice(0, 4)
                      .map(([amenity, count]) => (
                        <span key={amenity} className="amenity-tag">
                          {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/([A-Z])/g, ' $1')}: {count}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Match Bonuses */}
                {(match.bonuses.rating !== 0 || match.bonuses.amenities !== 0) && (
                  <div className="bonuses-section">
                    <h4>Match Bonuses</h4>
                    <div className="bonuses-list">
                      {match.bonuses.rating !== 0 && (
                        <div className="bonus-item">
                          <span className="bonus-icon">⭐</span>
                          <span>Rating bonus: +{match.bonuses.rating} points</span>
                        </div>
                      )}
                      {match.bonuses.amenities !== 0 && (
                        <div className="bonus-item">
                          <span className="bonus-icon">🏢</span>
                          <span>Amenities bonus: +{match.bonuses.amenities} points</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="match-actions">
                <Link 
                  to={`/neighborhoods/${match.neighborhood._id}`} 
                  className="btn btn-primary"
                >
                  View Details
                </Link>
                <button className="btn btn-outline">
                  Save for Later
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMatches.length === 0 && matches.length > 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No matches found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button 
              onClick={() => setFilters({ minScore: 0, city: '', sortBy: 'score' })}
              className="btn btn-primary"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="matches-cta">
          <div className="cta-content">
            <h2>Want Better Matches?</h2>
            <p>Update your preferences to get more personalized recommendations</p>
            <div className="cta-actions">
              <Link to="/preferences" className="btn btn-primary">
                Update Preferences
              </Link>
              <Link to="/neighborhoods" className="btn btn-outline">
                Explore All Neighborhoods
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;