import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import './Neighborhoods.css';

interface Neighborhood {
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
  imageUrl?: string; // Added imageUrl to the interface
}

interface Filters {
  city: string;
  state: string;
  minSafety: number;
  maxRent: number;
  sortBy: string;
}

const Neighborhoods: React.FC = () => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [filters, setFilters] = useState<Filters>({
    city: '',
    state: '',
    minSafety: 0, // Changed from 1 to 0 to show all neighborhoods by default
    maxRent: 100000,
    sortBy: 'name'
  });

  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    fetchNeighborhoods();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    applyFilters();
  }, [neighborhoods, filters, searchTerm]);

  const fetchNeighborhoods = async () => {
    try {
      setLoading(true);
      const response = await api.get('/neighborhoods', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: filters.sortBy
        }
      });
      const data = response.data;
      
      setNeighborhoods(data.neighborhoods);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
      
      // Extract unique cities and states for filters
      const uniqueCities = [...new Set(data.neighborhoods.map((n: Neighborhood) => n.city))].sort() as string[];
      const uniqueStates = [...new Set(data.neighborhoods.map((n: Neighborhood) => n.state))].sort() as string[];
      
      setCities(uniqueCities);
      setStates(uniqueStates);
      
    } catch (err: any) {
      console.error('Error fetching neighborhoods:', err);
      const msg = 'Failed to load neighborhoods';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = neighborhoods.filter(neighborhood => {
      // Search term filter
      const matchesSearch = neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           neighborhood.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           neighborhood.state.toLowerCase().includes(searchTerm.toLowerCase());
      
      // City filter
      const matchesCity = !filters.city || neighborhood.city === filters.city;
      
      // State filter
      const matchesState = !filters.state || neighborhood.state === filters.state;
      
      // Safety filter
      const matchesSafety = neighborhood.metrics.safety >= filters.minSafety;
      
      // Rent filter (check if any housing option is within budget)
      const matchesRent = !neighborhood.housing || 
                         (neighborhood.housing.averageRent1BHK && neighborhood.housing.averageRent1BHK <= filters.maxRent) ||
                         (neighborhood.housing.averageRent2BHK && neighborhood.housing.averageRent2BHK <= filters.maxRent) ||
                         (neighborhood.housing.averageRent3BHK && neighborhood.housing.averageRent3BHK <= filters.maxRent);
      
      const shouldInclude = matchesSearch && matchesCity && matchesState && matchesSafety && matchesRent;
      
      // Debug logging for filtered out neighborhoods
      if (!shouldInclude) {
        console.log(`Neighborhood "${neighborhood.name}" filtered out:`, {
          matchesSearch,
          matchesCity,
          matchesState,
          matchesSafety,
          matchesRent,
          safety: neighborhood.metrics.safety,
          minSafety: filters.minSafety
        });
      }
      
      return shouldInclude;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'city':
          return a.city.localeCompare(b.city);
        case 'safety':
          return b.metrics.safety - a.metrics.safety;
        case 'affordability':
          return b.metrics.affordability - a.metrics.affordability;
        case 'rating':
          return b.overallRating - a.overallRating;
        default:
          return 0;
      }
    });

    setFilteredNeighborhoods(filtered);
  };

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      state: '',
      minSafety: 0, // Changed from 1 to 0 to show all neighborhoods by default
      maxRent: 100000,
      sortBy: 'name'
    });
    setSearchTerm('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getMetricColor = (value: number) => {
    if (value >= 8) return '#48bb78'; // Green
    if (value >= 6) return '#ed8936'; // Orange
    return '#f56565'; // Red
  };

  if (loading) {
    return (
      <div className="neighborhoods-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading neighborhoods...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neighborhoods-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Explore Neighborhoods</h1>
          <p>Discover neighborhoods across India with detailed insights and data</p>
        </div>



        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search neighborhoods, cities, or states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="filter-select"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">State</label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="filter-select"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Min Safety Score</label>
              <select
                value={filters.minSafety}
                onChange={(e) => handleFilterChange('minSafety', parseInt(e.target.value))}
                className="filter-select"
              >
                <option value={0}>Any Safety</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                  <option key={score} value={score}>{score}+</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Max Rent (₹)</label>
              <select
                value={filters.maxRent}
                onChange={(e) => handleFilterChange('maxRent', parseInt(e.target.value))}
                className="filter-select"
              >
                <option value={100000}>Any Budget</option>
                <option value={15000}>Under ₹15,000</option>
                <option value={25000}>Under ₹25,000</option>
                <option value={40000}>Under ₹40,000</option>
                <option value={60000}>Under ₹60,000</option>
                <option value={80000}>Under ₹80,000</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="name">Name</option>
                <option value="city">City</option>
                <option value="safety">Safety Score</option>
                <option value="affordability">Affordability</option>
                <option value="rating">Overall Rating</option>
              </select>
            </div>

            <button onClick={resetFilters} className="btn btn-outline">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing {filteredNeighborhoods.length} of {neighborhoods.length} neighborhoods
            {neighborhoods.length !== totalItems && ` (${totalItems} total in database)`}
            {filteredNeighborhoods.length !== neighborhoods.length && (
              <span style={{ color: '#666', fontSize: '0.9em' }}>
                {' '}• {neighborhoods.length - filteredNeighborhoods.length} filtered out
              </span>
            )}
          </p>
        </div>

        {/* Neighborhoods Grid */}
        <div className="neighborhoods-grid">
          {filteredNeighborhoods.map(neighborhood => (
            <div key={neighborhood._id} className="neighborhood-card">
              {/* Image at the top */}
              <div className="neighborhood-image-container" style={{ width: '100%', height: 160, marginBottom: 12, background: '#f3f3f3', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {neighborhood.imageUrl ? (
                  <img src={neighborhood.imageUrl} alt={neighborhood.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#bbb', fontSize: 32 }}>No image</span>
                )}
              </div>
              <div className="card-header">
                <h3 className="neighborhood-name">{neighborhood.name}</h3>
                <div className="neighborhood-location">
                  📍 {neighborhood.city}, {neighborhood.state}
                </div>
                <div className="overall-rating">
                  ⭐ {neighborhood.overallRating.toFixed(1)}
                </div>
              </div>

              <div className="metrics-grid">
                {Object.entries(neighborhood.metrics).map(([key, value]) => (
                  <div key={key} className="metric-item">
                    <span className="metric-label">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ 
                          width: `${value * 10}%`,
                          backgroundColor: getMetricColor(value)
                        }}
                      ></div>
                    </div>
                    <span className="metric-value">{value}/10</span>
                  </div>
                ))}
              </div>

              {neighborhood.housing && (
                <div className="housing-info">
                  <h4>Rental Prices</h4>
                  <div className="rent-prices">
                    {neighborhood.housing.averageRent1BHK && (
                      <span className="rent-item">1BHK: ₹{neighborhood.housing.averageRent1BHK.toLocaleString()}</span>
                    )}
                    {neighborhood.housing.averageRent2BHK && (
                      <span className="rent-item">2BHK: ₹{neighborhood.housing.averageRent2BHK.toLocaleString()}</span>
                    )}
                    {neighborhood.housing.averageRent3BHK && (
                      <span className="rent-item">3BHK: ₹{neighborhood.housing.averageRent3BHK.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="amenities-summary">
                <h4>Amenities</h4>
                <div className="amenities-list">
                  {Object.entries(neighborhood.amenities).map(([key, count]) => (
                    count > 0 && (
                      <span key={key} className="amenity-tag">
                        {key}: {count}
                      </span>
                    )
                  ))}
                </div>
              </div>

              <div className="card-actions">
                <Link 
                  to={`/neighborhoods/${neighborhood._id}`} 
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-container" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem' }}
            >
              Previous
            </button>
            
            <div className="page-numbers" style={{ display: 'flex', gap: '0.5rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.5rem 0.75rem', minWidth: '2.5rem' }}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem' }}
            >
              Next
            </button>
            
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        )}

        {/* Show pagination info even when there's only one page */}
        {totalPages === 1 && totalItems > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9em' }}>
            Showing all {totalItems} neighborhoods
          </div>
        )}

        {filteredNeighborhoods.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No neighborhoods found</h3>
            <p>Try adjusting your search criteria or filters</p>
            <button onClick={resetFilters} className="btn btn-primary">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Neighborhoods;