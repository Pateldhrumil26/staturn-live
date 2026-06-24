import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          <p className="font-display font-medium text-gray-500">Loading RentaLite Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'Admin') {
    // Redirect to home if user role is not admin but tries to access admin routes
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
