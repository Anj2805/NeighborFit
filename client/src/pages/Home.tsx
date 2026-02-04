import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';
import { useUserInsights } from '../contexts/UserInsightsContext';

const metrics = [
  { label: 'Curated Neighborhoods', value: '500+' },
  { label: 'Cities Covered', value: '50+' },
  { label: 'Lifestyle Matches', value: '10K+' },
  { label: 'Match Accuracy', value: '95%' }
];

const featureHighlights = [
  {
    icon: '🎯',
    title: 'Lifestyle Match Engine',
    description: 'Weighted scoring blends safety, affordability, commute time, and vibe to pinpoint your best-fit areas.'
  },
  {
    icon: '📊',
    title: 'Realtime Insight Feed',
    description: 'Live cards show match scores, view counts, and trend deltas so you understand how recommendations evolve.'
  },
  {
    icon: '👥',
    title: 'User-Centric Journey',
    description: 'Preference onboarding, transparent matches, and profile insights give residents confidence to decide.'
  }
];

const workflowSteps = [
  {
    title: 'Define What Matters',
    description: 'Tell us about your household, commute limits, lifestyle priorities, and budget guardrails.',
    icon: '1'
  },
  {
    title: 'We Crunch The Data',
    description: 'NeighborFit analyzes 100+ metrics per neighborhood, factoring in reviews, view counts, and match success.',
    icon: '2'
  },
  {
    title: 'Track & Refine',
    description: 'Use the admin-ready analytics to spot trends, import neighborhoods, and adjust matches in real time.',
    icon: '3'
  }
];

const testimonials = [
  {
    quote: 'Within a week we short-listed three micro-neighborhoods that matched our toddler-friendly, metro-connected checklist.',
    author: 'Rhea S., New Delhi'
  },
  {
    quote: 'The admin dashboard keeps our ops team on top of growth, reviews, and sentiment—no spreadsheets required.',
    author: 'Imran Q., NeighborFit Admin'
  }
];

const algorithmStages = [
  {
    title: 'Signal Intake',
    details: 'Neighborhood metrics (safety, affordability, transit, sentiment) and user inputs flow into the scoring pipeline every hour.'
  },
  {
    title: 'Preference Weighting',
    details: 'Each slider you set becomes a weight; we normalize scores to 0-100 and emphasize what you marked as “critical.”'
  },
  {
    title: 'Confidence Boosters',
    details: 'Review quality, view counts, and matching success adjust the final recommendation so high-signal areas rise to the top.'
  },
  {
    title: 'Feedback Loop',
    details: 'Actions you take—saving a match, leaving a review—feed back into the model so future suggestions feel even more personal.'
  }
];

const experienceCards = [
  {
    icon: '✨',
    title: 'Guided Onboarding',
    description: 'Answer a few vivid lifestyle prompts and watch your match dial adjust in real time.',
    cta: 'Set Preferences',
    link: '/preferences'
  },
  {
    icon: '🧭',
    title: 'Explore With Context',
    description: 'Swipe through curated neighborhoods, each with trend capsules, costs, and sentiment snapshots.',
    cta: 'Browse Neighborhoods',
    link: '/neighborhoods'
  },
  {
    icon: '📬',
    title: 'Stay Notified',
    description: 'Save favorites and receive gentle nudges when new matches spike above your threshold.',
    cta: 'View Matches',
    link: '/matches'
  }
];

const defaultInsightSnapshots = [
  { label: 'Top Match Confidence', value: '92%', detail: 'Connaught Place · Delhi' },
  { label: 'Budget Fit Score', value: '87%', detail: 'Rs. 65K–90K · within range' },
  { label: 'Commute Sweet Spot', value: '32 min', detail: 'Average travel time to workplace' },
  { label: 'Lifestyle Alignment', value: '4.8/5', detail: 'Nightlife, walkability, community' }
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const { insights } = useUserInsights();

  return (
    <div className="home">
      <section className="hero hero-banner">
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">Lifestyle intelligence · Realtime admin controls</p>
            <h1 className="hero-title">
              Find Your Perfect <span className="highlight">Neighborhood Match</span>
            </h1>
            <p className="hero-description">
              NeighborFit blends user preferences, live platform analytics, and curated data to recommend where life will feel just right.
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
            <div className="hero-metrics">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <span>{metric.value}</span>
                  <p>{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
                alt="Illustration of vibrant neighborhoods"
              />
              <div className="hero-illustration__glow" />
            </div>
          </div>
        </div>
      </section>

      <section className="experience">
        <div className="container experience-grid">
          {experienceCards.map((card) => (
            <article key={card.title} className="experience-card">
              <div className="experience-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link to={card.link} className="experience-link">
                {card.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
              <span className="section-tag">Platform Highlights</span>
              <h2>
                Human-centered discovery with<br />transparent insights
              </h2>
          </div>
            <p>
              From onboarding to daily browsing, NeighborFit keeps residents informed with contextual cues
              and live data so every step feels intentional.
            </p>
          <div className="features-grid">
            {featureHighlights.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {user?.isAdmin && (
        <section className="admin-preview">
          <div className="container admin-grid">
            <div className="admin-preview__copy">
              <span className="section-tag">Admin Control Center</span>
              <h2>Realtime analytics, CSV/PDF exports, and live activity monitoring</h2>
              <p>
                The new admin experience features Socket.io notifications, bulk user tooling, neighborhood import/export flows,
                and sentiment dashboards. Manage communities confidently while residents get instant updates.
              </p>
              <ul>
                <li>Live user counts, growth charts, and city distribution insights</li>
                <li>Bulk actions, impersonation, and soft-delete safeguards</li>
                <li>Neighborhood editor with image management and validation</li>
                <li>System health & backup controls for super admins</li>
              </ul>
              <Link to="/admin" className="btn btn-primary ghost">
                Explore Admin Portal
              </Link>
            </div>
            <div className="admin-preview__card">
              <div className="admin-preview__screen">
                <div className="screen-header">
                  <span>Live Dashboard</span>
                  <div className="pills">
                    <span>Heatmap</span>
                    <span>Matches</span>
                    <span>Events</span>
                  </div>
                </div>
                <div className="screen-chart" />
                <div className="screen-list">
                  <div>
                    <p>New user registered</p>
                    <small>1 min ago</small>
                  </div>
                  <div>
                    <p>Neighborhood updated</p>
                    <small>3 min ago</small>
                  </div>
                  <div>
                    <p>Backup queued</p>
                    <small>10 min ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="insights">
        <div className="container">
          <div className="insights-header">
            <div>
              <span className="section-tag">Live Insight Cards</span>
              <h2>Glanceable analytics built for residents</h2>
              <p>Mini dashboards on your personal homepage highlight how the algorithm is reacting to your preferences.</p>
            </div>
            {user ? (
              <Link to="/dashboard" className="btn btn-secondary">
                Open Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn btn-secondary">
                Create Account
              </Link>
            )}
          </div>
          <div className="insight-mosaic">
            {(insights.length ? insights : defaultInsightSnapshots).map((insight) => (
              <div key={insight.label} className="insight-card">
                <span className="insight-value">{insight.value}</span>
                <h4>{insight.label}</h4>
                <p>{insight.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="algorithm">
        <div className="container">
          <div className="section-header">
              <span className="section-tag">How Matching Works</span>
              <h2>
                See the science behind your<br />neighborhood recommendations
              </h2>
          </div>
            <p>
              Every preference you set powers the NeighborFit engine to deliver transparent, explainable results
              before you ever book a tour.
            </p>
          <div className="algorithm-grid">
            {algorithmStages.map((stage) => (
              <article key={stage.title}>
                <h3>{stage.title}</h3>
                <p>{stage.details}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="workflow">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">End-to-end Journey</span>
            <h2>Guided flow from preferences to confident decisions</h2>
          </div>
          <div className="workflow-grid">
            {workflowSteps.map((step) => (
              <article key={step.title}>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="testimonials-head">
            <span className="section-tag">Voices From The Community</span>
            <div className="testimonials-head__copy">
              <h2>Real people, real moves</h2>
              <p>Hear how households and admins use NeighborFit to shortlist locations, collaborate, and act quickly.</p>
            </div>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <figure key={item.author}>
                <blockquote>
                  <p>“{item.quote}”</p>
                </blockquote>
                <figcaption>{item.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <br /><br />
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <span className="section-tag">Start today</span>
            <h2>Ready to find a neighborhood that feels like home?</h2>
            <p>Join households and admins using NeighborFit to match faster, monitor smarter, and make data-backed moves.</p>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-large">
                Create Your Profile
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
