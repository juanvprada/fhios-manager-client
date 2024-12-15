// ProtectedRoute.jsx
import React, { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/store';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Usar useMemo para evitar recálculos innecesarios
  const authState = useMemo(() => {
    return useStore.getState();
  }, []); // Solo se ejecuta una vez


  // Redirigir si no está autenticado
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir si requiere ser admin y no lo es
  if (adminOnly && authState.role !== 'admin') {
    return <Navigate to="/projects" replace />;
  }

  // Renderizar children si existen, sino usar Outlet para rutas anidadas
  return children || <Outlet />;
};

export default React.memo(ProtectedRoute);