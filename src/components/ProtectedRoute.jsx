import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/store';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useStore.getState();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;