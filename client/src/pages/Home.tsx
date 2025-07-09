import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Perfect
              <span className="highlight"> Neighborhood Match</span>
            </h1>
            <p className="hero-description">
              Discover neighborhoods that align with your lifestyle through our 
              data-driven matching algorithm. Make informed decisions about where 
              to live based on safety, affordability, amenities, and more.
            </p>
            <div className="hero-actions">
              {user ? (
                <>
                  <Link to="/matches" className="btn btn-primary">
                    View My Matches
                  </Link>
                  <Link to="/preferences" className="btn btn-secondary">
                    Update Preferences
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Get Started Free
                  </Link>
                  <Link to="/neighborhoods" className="btn btn-secondary">
                    Explore Neighborhoods
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="building building-1">🏢</div>
              <div className="building building-2">🏠</div>
              <div className="building building-3">🏘️</div>
              <div className="building building-4">🏬</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose NeighborFit?</h2>
            <p>Our intelligent matching system considers multiple factors to find your ideal neighborhood</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Matching</h3>
              <p>Our algorithm analyzes your preferences and matches you with neighborhoods that fit your lifestyle</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data-Driven Insights</h3>
              <p>Make informed decisions with comprehensive data on safety, affordability, amenities, and more</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏘️</div>
              <h3>Comprehensive Database</h3>
              <p>Explore detailed information about neighborhoods across major Indian cities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Community Reviews</h3>
              <p>Read authentic reviews from residents to get real insights about neighborhood life</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚇</div>
              <h3>Transport Analysis</h3>
              <p>Understand commute options and accessibility to make the right choice for your daily travel</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Budget Planning</h3>
              <p>Filter neighborhoods by your budget and get realistic cost estimates for living expenses</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get matched with your perfect neighborhood in three simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Set Your Preferences</h3>
                <p>Tell us what matters most to you - safety, nightlife, walkability, budget, and more</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Get Matched</h3>
                <p>Our algorithm analyzes thousands of data points to find neighborhoods that fit your lifestyle</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Explore & Decide</h3>
                <p>Review detailed insights, read community reviews, and make an informed decision</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Neighborhoods</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Match Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Neighborhood?</h2>
            <p>Join thousands of users who have found their ideal home with NeighborFit</p>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-large">
                Start Your Journey
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;