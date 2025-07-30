import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import './NeighborhoodDetail.css';

interface Neighborhood {
  _id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  metrics: {
    safety: number;
    affordability: number;
    cleanliness: number;
    walkability: number;
    nightlife: number;
    transport: number;
  };
  demographics: {
    averageAge: number;
    populationDensity: number;
    averageIncome: number;
  };
  amenities: {
    schools: number;
    hospitals: number;
    parks: number;
    restaurants: number;
    shoppingCenters: number;
    gyms: number;
  };
  housing: {
    averageRent1BHK: number;
    averageRent2BHK: number;
    averageRent3BHK: number;
    averagePropertyPrice: number;
  };
  nearbyTransportHubs: Array<{
    name: string;
    type: string;
    distance: number;
  }>;
  reviews: Array<{
    _id: string;
    userId: {
      name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  overallRating: number;
  imageUrl?: string; // Added imageUrl to the interface
}

interface MatchDetails {
  matchScore: number;
  breakdown: {
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
  recommendations: string[];
}

const NeighborhoodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchNeighborhoodDetails();
    }
  }, [id]);

  const fetchNeighborhoodDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch neighborhood details
      const neighborhoodResponse = await api.get(`/neighborhoods/${id}`);
      setNeighborhood(neighborhoodResponse.data);
      
      // Fetch match details if user is logged in
      if (user) {
        try {
          const matchResponse = await api.get(`/neighborhoods/${id}/match`);
          setMatchDetails(matchResponse.data);
        } catch (matchError) {
          console.log('No match details available (user may not have preferences set)');
        }
      }
      
    } catch (err: any) {
      console.error('Error fetching neighborhood details:', err);
      setError('Failed to load neighborhood details');
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 8) return '#48bb78'; // Green
    if (value >= 6) return '#ed8936'; // Orange
    return '#f56565'; // Red
  };

  const getMetricIcon = (metric: string) => {
    const icons: { [key: string]: string } = {
      safety: '🛡️',
      affordability: '💰',
      cleanliness: '✨',
      walkability: '🚶',
      nightlife: '🌃',
      transport: '🚇'
    };
    return icons[metric] || '📊';
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: string } = {
      schools: '🏫',
      hospitals: '🏥',
      parks: '🌳',
      restaurants: '🍽️',
      shoppingCenters: '🛍️',
      gyms: '💪'
    };
    return icons[amenity] || '📍';
  };

  const getTransportIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      metro: '🚇',
      bus: '🚌',
      railway: '🚂',
      airport: '✈️'
    };
    return icons[type] || '🚌';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="neighborhood-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading neighborhood details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !neighborhood) {
    return (
      <div className="neighborhood-detail-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Neighborhood Not Found</h2>
            <p>{error || 'The neighborhood you are looking for does not exist.'}</p>
            <Link to="/neighborhoods" className="btn btn-primary">
              Back to Neighborhoods
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neighborhood-detail-page">
      <div className="container">
        {/* Image at the top */}
        <div className="detail-image-container" style={{ width: '100%', height: 260, marginBottom: 24, background: '#f3f3f3', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {neighborhood.imageUrl ? (
            <img src={neighborhood.imageUrl} alt={neighborhood.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#bbb', fontSize: 40 }}>No image</span>
          )}
        </div>
        {/* Header */}
        <div className="detail-header">
          <div className="breadcrumb">
            <Link to="/neighborhoods">Neighborhoods</Link>
            <span>›</span>
            <span>{neighborhood.name}</span>
          </div>
          
          <div className="header-content">
            <div className="header-info">
              <h1>{neighborhood.name}</h1>
              <div className="location">
                📍 {neighborhood.city}, {neighborhood.state}, {neighborhood.country}
              </div>
              <div className="rating">
                ⭐ {neighborhood.overallRating.toFixed(1)} ({neighborhood.reviews.length} reviews)
              </div>
            </div>
            
            {matchDetails && (
              <div className="match-score-card">
                <div className="match-score">{matchDetails.matchScore}%</div>
                <div className="match-label">Match Score</div>
                <div className="match-description">
                  Based on your preferences
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="detail-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            Lifestyle Metrics
          </button>
          <button
            className={`tab ${activeTab === 'amenities' ? 'active' : ''}`}
            onClick={() => setActiveTab('amenities')}
          >
            Amenities
          </button>
          <button
            className={`tab ${activeTab === 'housing' ? 'active' : ''}`}
            onClick={() => setActiveTab('housing')}
          >
            Housing
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          {matchDetails && (
            <button
              className={`tab ${activeTab === 'match' ? 'active' : ''}`}
              onClick={() => setActiveTab('match')}
            >
              Match Analysis
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Demographics</h3>
                  <div className="demo-stats">
                    <div className="demo-stat">
                      <span className="stat-label">Average Age</span>
                      <span className="stat-value">{neighborhood.demographics.averageAge} years</span>
                    </div>
                    <div className="demo-stat">
                      <span className="stat-label">Population Density</span>
                      <span className="stat-value">{neighborhood.demographics.populationDensity.toLocaleString()}/km²</span>
                    </div>
                    <div className="demo-stat">
                      <span className="stat-label">Average Income</span>
                      <span className="stat-value">₹{neighborhood.demographics.averageIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Quick Stats</h3>
                  <div className="quick-stats">
                    <div className="quick-stat">
                      <div className="stat-icon">🏠</div>
                      <div className="stat-info">
                        <div className="stat-number">{Object.values(neighborhood.amenities).reduce((a, b) => a + b, 0)}</div>
                        <div className="stat-text">Total Amenities</div>
                      </div>
                    </div>
                    <div className="quick-stat">
                      <div className="stat-icon">🚇</div>
                      <div className="stat-info">
                        <div className="stat-number">{neighborhood.nearbyTransportHubs.length}</div>
                        <div className="stat-text">Transport Hubs</div>
                      </div>
                    </div>
                    <div className="quick-stat">
                      <div className="stat-icon">💬</div>
                      <div className="stat-info">
                        <div className="stat-number">{neighborhood.reviews.length}</div>
                        <div className="stat-text">Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {neighborhood.nearbyTransportHubs.length > 0 && (
                <div className="transport-section">
                  <h3>Nearby Transport</h3>
                  <div className="transport-grid">
                    {neighborhood.nearbyTransportHubs.map((hub, index) => (
                      <div key={index} className="transport-item">
                        <div className="transport-icon">{getTransportIcon(hub.type)}</div>
                        <div className="transport-info">
                          <div className="transport-name">{hub.name}</div>
                          <div className="transport-distance">{hub.distance} km away</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="metrics-content">
              <div className="metrics-grid">
                {Object.entries(neighborhood.metrics).map(([key, value]) => (
                  <div key={key} className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon">{getMetricIcon(key)}</div>
                      <div className="metric-title">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                    </div>
                    <div className="metric-score">{value}/10</div>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ 
                          width: `${value * 10}%`,
                          backgroundColor: getMetricColor(value)
                        }}
                      ></div>
                    </div>
                    <div className="metric-description">
                      {value >= 8 ? 'Excellent' : value >= 6 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Tab */}
          {activeTab === 'amenities' && (
            <div className="amenities-content">
              <div className="amenities-grid">
                {Object.entries(neighborhood.amenities).map(([key, count]) => (
                  <div key={key} className="amenity-card">
                    <div className="amenity-icon">{getAmenityIcon(key)}</div>
                    <div className="amenity-info">
                      <div className="amenity-name">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="amenity-count">{count} nearby</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Housing Tab */}
          {activeTab === 'housing' && (
            <div className="housing-content">
              <div className="housing-grid">
                <div className="housing-card">
                  <h3>Rental Prices</h3>
                  <div className="rent-list">
                    <div className="rent-item">
                      <span className="rent-type">1 BHK</span>
                      <span className="rent-price">₹{neighborhood.housing.averageRent1BHK.toLocaleString()}/month</span>
                    </div>
                    <div className="rent-item">
                      <span className="rent-type">2 BHK</span>
                      <span className="rent-price">₹{neighborhood.housing.averageRent2BHK.toLocaleString()}/month</span>
                    </div>
                    <div className="rent-item">
                      <span className="rent-type">3 BHK</span>
                      <span className="rent-price">₹{neighborhood.housing.averageRent3BHK.toLocaleString()}/month</span>
                    </div>
                  </div>
                </div>

                <div className="housing-card">
                  <h3>Property Prices</h3>
                  <div className="property-price">
                    <div className="price-label">Average Property Price</div>
                    <div className="price-value">₹{neighborhood.housing.averagePropertyPrice.toLocaleString()}</div>
                    <div className="price-note">Per square foot</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="reviews-content">
              {neighborhood.reviews.length > 0 ? (
                <div className="reviews-list">
                  {neighborhood.reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-name">{review.userId.name}</div>
                          <div className="review-date">{formatDate(review.createdAt)}</div>
                        </div>
                        <div className="review-rating">
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reviews">
                  <div className="no-reviews-icon">💬</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to share your experience about this neighborhood!</p>
                </div>
              )}
            </div>
          )}

          {/* Match Analysis Tab */}
          {activeTab === 'match' && matchDetails && (
            <div className="match-content">
              <div className="match-summary">
                <div className="match-score-large">{matchDetails.matchScore}%</div>
                <div className="match-description">
                  This neighborhood matches your lifestyle preferences
                </div>
              </div>

              <div className="match-breakdown">
                <h3>Detailed Breakdown</h3>
                <div className="breakdown-grid">
                  {Object.entries(matchDetails.breakdown).map(([metric, data]) => (
                    <div key={metric} className="breakdown-item">
                      <div className="breakdown-header">
                        <span className="breakdown-metric">
                          {metric.charAt(0).toUpperCase() + metric.slice(1)}
                        </span>
                        <span className="breakdown-score">{data.compatibility}%</span>
                      </div>
                      <div className="breakdown-details">
                        <div className="breakdown-detail">
                          Your importance: {data.userImportance}/10
                        </div>
                        <div className="breakdown-detail">
                          Neighborhood score: {data.neighborhoodScore}/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {matchDetails.recommendations.length > 0 && (
                <div className="recommendations">
                  <h3>Recommendations</h3>
                  <div className="recommendations-list">
                    {matchDetails.recommendations.map((recommendation, index) => (
                      <div key={index} className="recommendation-item">
                        💡 {recommendation}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="detail-actions">
          <Link to="/neighborhoods" className="btn btn-outline">
            ← Back to Neighborhoods
          </Link>
          {user && (
            <Link to="/matches" className="btn btn-primary">
              View All Matches
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodDetail;