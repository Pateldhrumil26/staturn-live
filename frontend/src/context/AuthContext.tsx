import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import API from '../services/api.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user from localStorage token on startup
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await API.get('/auth/profile');
          if (response.data.success) {
            setUser({ ...response.data.data, token });
          } else {
            logout();
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.success) {
        const userData = response.data.data;
        localStorage.setItem('token', userData.token);
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Network error, please try again later.',
      };
    }
  };

  // Register handler
  const register = async (userData: any) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.data.success) {
        const newUser = response.data.data;
        localStorage.setItem('token', newUser.token);
        setUser(newUser);
        return { success: true, user: newUser };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error: any) {
      console.error('Register API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed, email might be in use.',
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update profile handler
  const updateProfile = async (profileData: any) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      if (response.data.success) {
        const updatedUser = response.data.data;
        const currentToken = localStorage.getItem('token');
        setUser({ ...updatedUser, token: currentToken || undefined });
        return { success: true, user: updatedUser };
      }
      return { success: false, message: response.data.message || 'Profile update failed' };
    } catch (error: any) {
      console.error('Profile update API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed.',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
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
