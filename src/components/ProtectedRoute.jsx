import React from "react"; // Asegúrate de importar React
import PropTypes from "prop-types"; // Importa PropTypes para validar las props// ProtectedRoute.jsx
import { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/store';

const ProtectedRoute = ({ children, adminOnly }) => {
  // Usar useMemo para evitar recálculos innecesarios
  const authState = useMemo(() => {
    return useStore.getState();
  }, []); // Solo se ejecuta una vez

  // Log para debug
  console.log('Protected Route State:', {
    isAuthenticated: authState.isAuthenticated,
    role: authState.role,
    adminOnly
  });

  // Redirigir si no está autenticado
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir si requiere ser admin y no lo es
  if (adminOnly && authState.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Renderizar children si existen, sino usar Outlet para rutas anidadas
  return children || <Outlet />;
};

// Validaciones de las props
ProtectedRoute.propTypes = {
  children: PropTypes.node, // Validación para children
  adminOnly: PropTypes.bool, // Validación para adminOnly
};

// Valores por defecto para las props
ProtectedRoute.defaultProps = {
  adminOnly: false,
};

export default React.memo(ProtectedRoute);