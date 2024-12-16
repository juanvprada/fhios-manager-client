import { Navigate, Outlet } from "react-router-dom";
import { useCallback } from 'react';
import useStore from "../store/store";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const store = useStore();

  const checkPermission = useCallback(() => {
    if (!requiredPermission) return true;

    const userRoles = store.userRoles || [];
    if (!Array.isArray(userRoles)) return false;

    return userRoles.some(role => {
      const roleName = role?.role_name || role;
      const permissions = {
        'Project Manager': [
          'canManageProjects',
          'canAccessDashboard',
          'canCreateProjects',
          'canViewProjects',
          'canManageTeam'
        ],
        'Developer': [
          'canAccessDashboard',
          'canViewProjects'
        ],
        'Designer': [
          'canAccessDashboard',
          'canViewProjects'
        ],
        'Team Leader': [
          'canAccessDashboard',
          'canViewProjects',
          'canManageTeam'
        ],
        'QA Analyst': [
          'canAccessDashboard',
          'canViewProjects'
        ],
        'Administrador': [
          'canManageUsers',
          'canManageRoles',
          'canManageProjects',
          'canAccessDashboard',
          'canCreateProjects',
          'canViewProjects'
        ]
      };

      return permissions[roleName]?.includes(requiredPermission);
    });
  }, [requiredPermission, store.userRoles]);

  if (!store.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !checkPermission()) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;