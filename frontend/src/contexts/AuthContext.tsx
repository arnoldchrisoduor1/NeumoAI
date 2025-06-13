// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, full_name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
} as const;

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[AUTH INFO] ${new Date().toISOString()}: ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[AUTH ERROR] ${new Date().toISOString()}: ${message}`, error || '');
  },
  success: (message: string, data?: any) => {
    console.log(`[AUTH SUCCESS] ${new Date().toISOString()}: ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[AUTH WARN] ${new Date().toISOString()}: ${message}`, data || '');
  }
};

// Storage utilities
const storage = {
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      logger.info(`Stored ${key} in localStorage`);
    } catch (error) {
      logger.error(`Failed to store ${key} in localStorage`, error);
    }
  },
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        logger.info(`Retrieved ${key} from localStorage`);
        return JSON.parse(item);
      }
      return null;
    } catch (error) {
      logger.error(`Failed to retrieve ${key} from localStorage`, error);
      return null;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
      logger.info(`Removed ${key} from localStorage`);
    } catch (error) {
      logger.error(`Failed to remove ${key} from localStorage`, error);
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      logger.info('Cleared all auth data from localStorage');
    } catch (error) {
      logger.error('Failed to clear auth data from localStorage', error);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Computed property for authentication status
  const isAuthenticated = Boolean(token && user);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    logger.info('Initializing auth context from localStorage');
    try {
      const storedToken = storage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = storage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        logger.success('Auth state restored from localStorage', { 
          user: storedUser?.email || 'Unknown',
          hasToken: Boolean(storedToken)
        });
      } else {
        logger.info('No stored auth data found');
      }
    } catch (error) {
      logger.error('Failed to initialize auth state from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Persist auth state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    if (token && user) {
      storage.setItem(STORAGE_KEYS.TOKEN, token);
      storage.setItem(STORAGE_KEYS.USER, user);
    } else {
      storage.clear();
    }
  }, [token, user, isInitialized]);

  const login = async (email: string, password: string) => {
    logger.info('Login attempt started', { email });
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || 'Login failed';
        logger.error('Login failed - API error', { 
          status: response.status,
          error: errorMessage,
          email 
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.access_token) {
        logger.error('Login failed - no access token in response', data);
        throw new Error('No access token received from server');
      }

      const userData = { email, ...data.user };
      
      setToken(data.access_token);
      setUser(userData);
      
      logger.success('Login successful', { 
        user: email,
        tokenLength: data.access_token?.length || 0,
        message: data.message || 'Login completed'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during login';
      setError(errorMessage);
      logger.error('Login process failed', { error: errorMessage, email });
    } finally {
      setIsLoading(false);
      logger.info('Login attempt completed', { email });
    }
  };

  const register = async (email: string, password: string, username: string, full_name: string) => {
    logger.info('Registration attempt started', { email, username, full_name });
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, full_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || 'Registration failed';
        logger.error('Registration failed - API error', { 
          status: response.status,
          error: errorMessage,
          email,
          username 
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.access_token) {
        logger.error('Registration failed - no access token in response', data);
        throw new Error('No access token received from server');
      }

      const userData = { email, username, full_name, ...data.user };
      
      setToken(data.access_token);
      setUser(userData);
      
      logger.success('Registration successful', { 
        user: email,
        username,
        tokenLength: data.access_token?.length || 0,
        message: data.message || 'Registration completed'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during registration';
      setError(errorMessage);
      logger.error('Registration process failed', { error: errorMessage, email, username });
    } finally {
      setIsLoading(false);
      logger.info('Registration attempt completed', { email, username });
    }
  };

  const logout = () => {
    logger.info('Logout initiated', { user: user?.email || 'Unknown' });
    
    try {
      setUser(null);
      setToken(null);
      setError(null);
      storage.clear();
      
      logger.success('Logout completed successfully');
    } catch (error) {
      logger.error('Error during logout process', error);
    }
  };

  // Log authentication state changes
  useEffect(() => {
    if (isInitialized) {
      logger.info('Authentication state changed', {
        isAuthenticated,
        hasUser: Boolean(user),
        hasToken: Boolean(token),
        userEmail: user?.email || null
      });
    }
  }, [isAuthenticated, user, token, isInitialized]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};