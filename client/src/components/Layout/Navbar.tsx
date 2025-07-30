import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug logging
  console.log('Navbar Debug:', { user, loading, userName: user?.name });

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🏠</span>
          NeighborFit
        </Link>

        {/* Mobile menu button */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-nav">
            {/* Public links */}
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/')}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/neighborhoods" 
              className={`navbar-link ${isActive('/neighborhoods')}`}
              onClick={closeMenu}
            >
              Explore
            </Link>

            {/* Authenticated user links */}
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`navbar-link ${isActive('/dashboard')}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/matches" 
                  className={`navbar-link ${isActive('/matches')}`}
                  onClick={closeMenu}
                >
                  My Matches
                </Link>
                <Link 
                  to="/preferences" 
                  className={`navbar-link ${isActive('/preferences')}`}
                  onClick={closeMenu}
                >
                  Preferences
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className={`navbar-link ${isActive('/admin')}`}
                    onClick={closeMenu}
                  >
                    Admin Portal
                  </Link>
                )}
                
                {/* User dropdown */}
                <div className="navbar-user">
                  <div className="user-info">
                    <span className="user-avatar">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <span className="user-name">{user?.name || 'User'}</span>
                  </div>
                  <div className="user-dropdown">
                    <Link 
                      to="/profile" 
                      className="dropdown-link"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-link logout-btn"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Guest user links */
              <div className="navbar-auth">
                <Link 
                  to="/login" 
                  className={`navbar-link ${isActive('/login')}`}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`navbar-link navbar-cta ${isActive('/register')}`}
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;