import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * ProtectedRoute guards routes.
 * mode="auth" (default): requires authenticated user, otherwise redirect to /login.
 * mode="guest": blocks authenticated users, redirect to home.
 */
export default function ProtectedRoute({ mode = 'auth' }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (mode === 'guest') {
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
