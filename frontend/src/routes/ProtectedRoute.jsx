import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, token, loading, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Inactivity timeout: 15 minutes (900000 ms)
  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;

    const logoutUser = () => {
      logout();
      navigate('/login', { state: { message: 'You have been logged out due to inactivity.' } });
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutUser, INACTIVITY_LIMIT);
    };

    // Events to track user activity
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, logout, navigate]);

  if (loading && !user && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-indigo-600 font-semibold text-lg animate-pulse">Loading User Profile...</div>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  // Enforce email verification (exclude superadmin@example.com for testing if needed, or enforce for all)
  if (user && user.email_verified_at === null && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  // Redirect verified users away from the verification notice page
  if (user && user.email_verified_at !== null && location.pathname === '/verify-email') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
