import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../contexts/AuthContext';
import './Dashboard.css';

interface DashboardStats {
  totalMatches: number;
  topMatchScore: number;
  preferencesCompleted: boolean;
  recentActivity: string[];
}

interface QuickMatch {
  _id: string;
  name: string;
  city: string;
  state: string;
  matchScore: number;
  metrics: {
    safety: number;
    affordability: number;
    cleanliness: number;
    walkability: number;
    nightlife: number;
    transport: number;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quickMatches, setQuickMatches] = useState<QuickMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user preferences to check if completed
      const preferencesResponse = await api.get('/preferences');
      const hasPreferences = preferencesResponse.data !== null;
      
      let matches = [];
      let topScore = 0;
      
      if (hasPreferences) {
        // Fetch matches if preferences exist
        const matchesResponse = await api.get('/neighborhoods/matches');
        matches = matchesResponse.data.slice(0, 3); // Top 3 matches
        topScore = matches.length > 0 ? matches[0].matchScore : 0;
      }
      
      setStats({
        totalMatches: matches.length,
        topMatchScore: topScore,
        preferencesCompleted: hasPreferences,
        recentActivity: [
          'Profile updated',
          'New neighborhood matches found',
          'Preferences saved'
        ]
      });
      
      setQuickMatches(matches);
      
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Here's what's happening with your neighborhood search</p>
          </div>
          <div className="header-actions">
            <Link to="/preferences" className="btn btn-outline">
              Update Preferences
            </Link>
            <Link to="/matches" className="btn btn-primary">
              View All Matches
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Quick Setup */}
        {!stats?.preferencesCompleted && (
          <div className="setup-banner">
            <div className="setup-content">
              <div className="setup-icon">🚀</div>
              <div className="setup-text">
                <h3>Complete Your Profile</h3>
                <p>Set your preferences to get personalized neighborhood matches</p>
              </div>
              <Link to="/preferences" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">{stats?.totalMatches || 0}</div>
              <div className="stat-label">Neighborhood Matches</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{stats?.topMatchScore || 0}%</div>
              <div className="stat-label">Best Match Score</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats?.preferencesCompleted ? 'Yes' : 'No'}</div>
              <div className="stat-label">Profile Complete</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏘️</div>
            <div className="stat-content">
              <div className="stat-number">500+</div>
              <div className="stat-label">Cities Available</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Quick Matches */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Your Top Matches</h2>
              <Link to="/matches" className="section-link">
                View All →
              </Link>
            </div>
            
            {quickMatches.length > 0 ? (
              <div className="matches-grid">
                {quickMatches.map((match) => (
                  <div key={match._id} className="match-card">
                    <div className="match-header">
                      <h3>{match.name}</h3>
                      <div className="match-score">
                        {match.matchScore}% match
                      </div>
                    </div>
                    <div className="match-location">
                      📍 {match.city}, {match.state}
                    </div>
                    <div className="match-metrics">
                      <div className="metric">
                        <span className="metric-label">Safety</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill" 
                            style={{ width: `${match.metrics.safety * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Affordability</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill" 
                            style={{ width: `${match.metrics.affordability * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Transport</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill" 
                            style={{ width: `${match.metrics.transport * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/neighborhoods/${match._id}`} 
                      className="btn btn-outline btn-small"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No matches yet</h3>
                <p>Complete your preferences to see personalized neighborhood matches</p>
                <Link to="/preferences" className="btn btn-primary">
                  Set Preferences
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <Link to="/neighborhoods" className="action-card">
                <div className="action-icon">🏘️</div>
                <div className="action-content">
                  <h3>Explore Neighborhoods</h3>
                  <p>Browse all available neighborhoods</p>
                </div>
              </Link>
              <Link to="/preferences" className="action-card">
                <div className="action-icon">⚙️</div>
                <div className="action-content">
                  <h3>Update Preferences</h3>
                  <p>Modify your lifestyle preferences</p>
                </div>
              </Link>
              <Link to="/profile" className="action-card">
                <div className="action-icon">👤</div>
                <div className="action-content">
                  <h3>Edit Profile</h3>
                  <p>Update your personal information</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;