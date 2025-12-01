import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAPP } from '../../contexts/AppContext'

const RequireAuth = ({ children, adminOnly = false }) => {
  const { user } = useAPP();
  const location = useLocation();

  // Not logged in -> redirect to login, preserve intended location
  if (!user) {
    // include the attempted path as `next` so Login can redirect back after auth
    const next = encodeURIComponent(location.pathname + (location.search || ''));
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // If adminOnly is requested but user is not admin -> redirect to home
  if (adminOnly) {
    const role = (user && user.role) ? String(user.role).toLowerCase() : null;
    const isAdmin = role === 'admin' || user?.isAdmin;
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default RequireAuth
