import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Set axios authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by making a test request
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // You could make a request to verify token, for now we'll trust localStorage
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      const { token: newToken, ...userData } = response.data;

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(newToken);
      setUser(userData);
      
      // Set axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await axios.post('/auth/register', {
        name,
        email,
        password
      });

      const { token: newToken, ...userData } = response.data;

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(newToken);
      setUser(userData);
      
      // Set axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // Remove axios header
    delete axios.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export axios instance with base configuration
export const api = axios;