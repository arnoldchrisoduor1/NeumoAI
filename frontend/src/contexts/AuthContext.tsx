// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  email: string;
  username?: string;
  full_name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, full_name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base API URL from env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

// Storage utilities with better error handling
const storage = {
  setItem: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      logger.info(`Stored ${key} in localStorage`);
    } catch (error) {
      logger.error(`Failed to store ${key} in localStorage`, error);
    }
  },
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
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
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      logger.info(`Removed ${key} from localStorage`);
    } catch (error) {
      logger.error(`Failed to remove ${key} from localStorage`, error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Compute isAuthenticated based on both token and user
  const isAuthenticated = Boolean(token && user && isInitialized);

  // Batch state update function to ensure consistency
  const updateAuthState = useCallback((newUser: User | null, newToken: string | null) => {
    // Use functional updates to ensure consistency
    setUser(newUser);
    setToken(newToken);
    
    // Force a re-render by updating a timestamp or counter if needed
    if (newUser && newToken) {
      logger.success('Auth state updated', { 
        user: newUser.email,
        hasToken: Boolean(newToken)
      });
    }
    setForceUpdate(prev => prev + 1);
  }, []);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      logger.info('Initializing auth context from localStorage');
      try {
        const storedToken = storage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = storage.getItem(STORAGE_KEYS.USER);

        if (storedToken && storedUser) {
          // Use batch update
          updateAuthState(storedUser, storedToken);
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
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      initializeAuth();
    }
  }, [updateAuthState]);

  // Sync auth state to localStorage when it changes
  useEffect(() => {
    if (!isInitialized) return;

    if (token && user) {
      storage.setItem(STORAGE_KEYS.TOKEN, token);
      storage.setItem(STORAGE_KEYS.USER, user);
    } else {
      storage.clear();
    }
  }, [token, user, isInitialized]);

  // Clear error when auth state changes
  useEffect(() => {
    if (error && (token || user)) {
      setError(null);
    }
  }, [token, user, error]);

  const login = async (email: string, password: string) => {
    logger.info('Login attempt started', { email });
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Login failed';
        logger.error('Login failed - API error', { 
          status: response.status,
          error: errorMessage,
          email 
        });
        throw new Error(errorMessage);
      }
      
      if (!data.access_token) {
        logger.error('Login failed - no access token in response', data);
        throw new Error('No access token received from server');
      }

      const userData: User = { 
        email, 
        ...(data.user || {})
      };
      
      // Use batch update instead of separate setState calls
      updateAuthState(userData, data.access_token);
      
      logger.success('Login successful', { 
        user: email,
        tokenLength: data.access_token?.length || 0,
        message: data.message || 'Login completed'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during login';
      setError(errorMessage);
      updateAuthState(null, null); // Batch clear on error
      logger.error('Login process failed', { error: errorMessage, email });
      throw err;
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
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, full_name }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.message || 'Registration failed';
        logger.error('Registration failed - API error', { 
          status: response.status,
          error: errorMessage,
          email,
          username 
        });
        throw new Error(errorMessage);
      }
      
      if (!data.access_token) {
        logger.error('Registration failed - no access token in response', data);
        throw new Error('No access token received from server');
      }

      const userData: User = { 
        email, 
        username, 
        full_name, 
        ...(data.user || {})
      };
      
      // Use batch update instead of separate setState calls
      updateAuthState(userData, data.access_token);
      
      logger.success('Registration successful', { 
        user: email,
        username,
        tokenLength: data.access_token?.length || 0,
        message: data.message || 'Registration completed'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during registration';
      setError(errorMessage);
      updateAuthState(null, null); // Batch clear on error
      logger.error('Registration process failed', { error: errorMessage, email, username });
      throw err;
    } finally {
      setIsLoading(false);
      logger.info('Registration attempt completed', { email, username });
    }
  };

  const logout = useCallback(() => {
    logger.info('Logout initiated', { user: user?.email || 'Unknown' });
    
    try {
      updateAuthState(null, null);
      setError(null);
      storage.clear();
      
      logger.success('Logout completed successfully');
    } catch (error) {
      logger.error('Error during logout process', error);
    }
  }, [user?.email, updateAuthState]);

  // Debug logging for state changes
  useEffect(() => {
    if (isInitialized) {
      logger.info('Authentication state changed', {
        isAuthenticated,
        hasUser: Boolean(user),
        hasToken: Boolean(token),
        userEmail: user?.email || null,
        isInitialized
      });
    }
  }, [isAuthenticated, user, token, isInitialized]);

  // Don't render children until initialized to prevent hydration issues
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      isLoading, 
      error,
      isInitialized,
      // forceUpdate
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