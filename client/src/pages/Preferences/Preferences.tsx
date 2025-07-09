import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import './Preferences.css';

interface PreferencesData {
  lifestyle: {
    safety: number;
    affordability: number;
    cleanliness: number;
    walkability: number;
    nightlife: number;
    transport: number;
  };
  demographics: {
    age: number;
    occupation: string;
    familyStatus: string;
    budget: {
      min: number;
      max: number;
    };
  };
  location: {
    currentCity: string;
    preferredCities: string[];
    maxCommuteTime: number;
  };
}

const Preferences: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [preferences, setPreferences] = useState<PreferencesData>({
    lifestyle: {
      safety: 5,
      affordability: 5,
      cleanliness: 5,
      walkability: 5,
      nightlife: 5,
      transport: 5
    },
    demographics: {
      age: 25,
      occupation: '',
      familyStatus: 'single',
      budget: {
        min: 10000,
        max: 50000
      }
    },
    location: {
      currentCity: '',
      preferredCities: [],
      maxCommuteTime: 30
    }
  });

  const [newCity, setNewCity] = useState('');

  const lifestyleLabels = {
    safety: 'Safety & Security',
    affordability: 'Affordability',
    cleanliness: 'Cleanliness',
    walkability: 'Walkability',
    nightlife: 'Nightlife & Entertainment',
    transport: 'Public Transport'
  };

  const familyStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'couple', label: 'Couple' },
    { value: 'family_with_kids', label: 'Family with Kids' },
    { value: 'retired', label: 'Retired' }
  ];

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
  ];

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/preferences');
      if (response.data) {
        setPreferences(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching preferences:', err);
      // Don't show error for new users who don't have preferences yet
    } finally {
      setLoading(false);
    }
  };

  const handleLifestyleChange = (key: keyof typeof preferences.lifestyle, value: number) => {
    setPreferences(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [key]: value
      }
    }));
  };

  const handleDemographicsChange = (key: string, value: any) => {
    if (key === 'budget.min') {
      setPreferences(prev => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          budget: {
            ...prev.demographics.budget,
            min: value
          }
        }
      }));
    } else if (key === 'budget.max') {
      setPreferences(prev => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          budget: {
            ...prev.demographics.budget,
            max: value
          }
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          [key]: value
        }
      }));
    }
  };

  const handleLocationChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value
      }
    }));
  };

  const addPreferredCity = () => {
    if (newCity && !preferences.location.preferredCities.includes(newCity)) {
      handleLocationChange('preferredCities', [...preferences.location.preferredCities, newCity]);
      setNewCity('');
    }
  };

  const removePreferredCity = (city: string) => {
    handleLocationChange('preferredCities', 
      preferences.location.preferredCities.filter(c => c !== city)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await api.post('/preferences', preferences);
      setSuccess('Preferences saved successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="preferences-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preferences-page">
      <div className="container">
        <div className="preferences-header">
          <h1>Set Your Preferences</h1>
          <p>Help us find the perfect neighborhood for you by sharing your lifestyle preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="preferences-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Lifestyle Preferences */}
          <div className="form-section">
            <h2>Lifestyle Preferences</h2>
            <p>Rate how important each factor is to you (1 = Not Important, 10 = Very Important)</p>
            
            <div className="lifestyle-grid">
              {Object.entries(lifestyleLabels).map(([key, label]) => {
                const currentValue = preferences.lifestyle[key as keyof typeof preferences.lifestyle];
                const getImportanceText = (value: number) => {
                  if (value <= 2) return 'Not Important';
                  if (value <= 4) return 'Slightly Important';
                  if (value <= 6) return 'Moderately Important';
                  if (value <= 8) return 'Very Important';
                  return 'Extremely Important';
                };
                
                const getImportanceColor = (value: number) => {
                  if (value <= 2) return '#ef4444'; // red
                  if (value <= 4) return '#f97316'; // orange
                  if (value <= 6) return '#eab308'; // yellow
                  if (value <= 8) return '#22c55e'; // green
                  return '#16a34a'; // dark green
                };

                return (
                  <div key={key} className="lifestyle-item">
                    <div className="lifestyle-header">
                      <label className="lifestyle-label">{label}</label>
                      <div className="lifestyle-value-container">
                        <span
                          className="lifestyle-value"
                          style={{ backgroundColor: getImportanceColor(currentValue) }}
                        >
                          {currentValue}
                        </span>
                        <span className="importance-text">
                          {getImportanceText(currentValue)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Star Rating System */}
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className={`star ${rating <= currentValue ? 'active' : ''}`}
                          onClick={() => handleLifestyleChange(
                            key as keyof typeof preferences.lifestyle,
                            rating
                          )}
                          onMouseEnter={(e) => {
                            // Add hover effect
                            const stars = e.currentTarget.parentElement?.querySelectorAll('.star');
                            stars?.forEach((star, index) => {
                              if (index < rating) {
                                star.classList.add('hover');
                              } else {
                                star.classList.remove('hover');
                              }
                            });
                          }}
                          onMouseLeave={(e) => {
                            // Remove hover effect
                            const stars = e.currentTarget.parentElement?.querySelectorAll('.star');
                            stars?.forEach((star) => {
                              star.classList.remove('hover');
                            });
                          }}
                          title={`Rate ${rating}/10`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    
                    {/* Alternative: Enhanced Slider */}
                    <div className="enhanced-slider-container">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentValue}
                        onChange={(e) => handleLifestyleChange(
                          key as keyof typeof preferences.lifestyle,
                          parseInt(e.target.value)
                        )}
                        className="enhanced-slider"
                        style={{
                          background: `linear-gradient(to right, ${getImportanceColor(currentValue)} 0%, ${getImportanceColor(currentValue)} ${(currentValue - 1) * 11.11}%, #e5e7eb ${(currentValue - 1) * 11.11}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="slider-ticks">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
                          <div
                            key={tick}
                            className={`tick ${tick <= currentValue ? 'active' : ''}`}
                            onClick={() => handleLifestyleChange(
                              key as keyof typeof preferences.lifestyle,
                              tick
                            )}
                          >
                            {tick}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="slider-labels">
                      <span>1 - Not Important</span>
                      <span>10 - Extremely Important</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demographics */}
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={preferences.demographics.age}
                  onChange={(e) => handleDemographicsChange('age', parseInt(e.target.value))}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  value={preferences.demographics.occupation}
                  onChange={(e) => handleDemographicsChange('occupation', e.target.value)}
                  className="form-input"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Family Status</label>
                <select
                  value={preferences.demographics.familyStatus}
                  onChange={(e) => handleDemographicsChange('familyStatus', e.target.value)}
                  className="form-select"
                  required
                >
                  {familyStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="budget-section">
              <h3>Budget Range (Monthly Rent in ₹)</h3>
              <div className="budget-inputs">
                <div className="form-group">
                  <label className="form-label">Minimum</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={preferences.demographics.budget.min}
                    onChange={(e) => handleDemographicsChange('budget.min', parseInt(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Maximum</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={preferences.demographics.budget.max}
                    onChange={(e) => handleDemographicsChange('budget.max', parseInt(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Preferences */}
          <div className="form-section">
            <h2>Location Preferences</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Current City</label>
                <select
                  value={preferences.location.currentCity}
                  onChange={(e) => handleLocationChange('currentCity', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select your current city</option>
                  {indianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Commute Time (minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={preferences.location.maxCommuteTime}
                  onChange={(e) => handleLocationChange('maxCommuteTime', parseInt(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="preferred-cities-section">
              <h3>Preferred Cities</h3>
              <div className="city-input">
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a city to add</option>
                  {indianCities
                    .filter(city => !preferences.location.preferredCities.includes(city))
                    .map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={addPreferredCity}
                  className="btn btn-outline"
                  disabled={!newCity}
                >
                  Add City
                </button>
              </div>
              
              <div className="selected-cities">
                {preferences.location.preferredCities.map(city => (
                  <div key={city} className="city-tag">
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => removePreferredCity(city)}
                      className="remove-city"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Preferences;