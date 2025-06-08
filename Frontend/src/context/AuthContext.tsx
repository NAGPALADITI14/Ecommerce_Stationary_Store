"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check localStorage for user data and token
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        
        // Optional: Verify token with your backend
        // const isValid = await verifyToken(storedToken);
        // if (isValid) {
          setUser(userData);
        // } else {
        //   localStorage.removeItem('user');
        //   localStorage.removeItem('authToken');
        // }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, token?: string) => {
    setUser(userData);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('authToken', token);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Optional: Call logout API endpoint
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });

      // Clear user state
      setUser(null);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      // Optional: Clear other user-related data
      localStorage.removeItem('cart');
      localStorage.removeItem('orders');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local data
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;