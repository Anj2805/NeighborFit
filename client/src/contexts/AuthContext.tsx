import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  roles?: string[];
  familyStatus?: string | null;
  city?: string | null;
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

const normalizeUser = (userData: any): User => {
  let roles: string[] = [];
  if (Array.isArray(userData.roles)) {
    roles = userData.roles;
  } else if (typeof userData.roles === 'string') {
    roles = userData.roles
      .split(',')
      .map((role: string) => role.replace(/["']/g, '').trim())
      .filter(Boolean);
  } else if (userData.isAdmin) {
    roles = ['admin'];
  } else {
    roles = ['user'];
  }

  if (!roles.includes('user')) {
    roles.push('user');
  }

  return {
    ...userData,
    roles,
    isAdmin: Boolean(userData.isAdmin || roles.includes('admin')),
    familyStatus: userData.familyStatus ?? null,
    city: userData.city ?? null
  };
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          const normalized = normalizeUser(parsedUser);
          localStorage.setItem('user', JSON.stringify(normalized));
          setUser(normalized);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token: newToken, ...userData } = response.data;
      const normalizedUser = normalizeUser(userData);

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      // Update state
      setToken(newToken);
      setUser(normalizedUser);
      
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      let message = 'Login failed';

      if (serverMessage) {
        // Map known server messages to friendlier messages
        if (serverMessage.includes('Invalid email or password')) {
          message = 'Invalid email or password. Please check your credentials or reset your password.';
        } else {
          message = serverMessage;
        }
      }

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      const { token: newToken, ...userData } = response.data;
      const normalizedUser = normalizeUser(userData);

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      // Update state
      setToken(newToken);
      setUser(normalizedUser);
      
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      let message = 'Registration failed';

      if (serverMessage) {
        // Map known server messages to friendlier messages
        if (serverMessage.includes('User already exists')) {
          message = 'An account with this email already exists. Please sign in.';
        } else {
          message = serverMessage;
        }
      }

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
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

// Export the api instance for use in other components
export { api };
