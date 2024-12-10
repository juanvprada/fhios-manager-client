// routes.jsx
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";
import UserManagement from "../pages/UserManagement";
import NewProject from "../pages/newProject";
import RegisterForm from "../pages/RegisterForm";
import LoginForm from "../pages/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import ProjectDetail from '../pages/ProjectDetail';
import CreateRole from '../pages/CreateRole';
import RolesManagement from "../pages/RolesManagement";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <h1 className="text-2xl font-poppins">Inicio</h1>,
      },
      {
        path: "registerform",
        element: <ProtectedRoute requiredPermission="canManageUsers">
          <RegisterForm />
        </ProtectedRoute>,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute requiredPermission="canAccessDashboard">
          <Dashboard />
        </ProtectedRoute>,
      },
      {
        path: "projects",
        element: <ProtectedRoute requiredPermission="canViewProjects">
          <Outlet />
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Projects />,
          },
          {
            path: "nuevo",
            element: <ProtectedRoute requiredPermission="canCreateProjects">
              <NewProject />
            </ProtectedRoute>,
          },
        ],
      },
      {
        path: "users",
        element: <ProtectedRoute requiredPermission="canManageUsers">
          <UserManagement />
        </ProtectedRoute>,
      },
      {
        path: "roles",
        element: <ProtectedRoute requiredPermission="canManageRoles">
          <Outlet />
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <RolesManagement />,
          },
          {
            path: "create",
            element: <CreateRole />
          }
        ],
      }
    ],
  },
]);