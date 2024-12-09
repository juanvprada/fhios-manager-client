// routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
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
    

    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <h1 className="text-2xl font-poppins">Inicio</h1>,
      },
      {
        path: "login",
    element: <LoginForm />,
      },
      {
       /*  Ruta protegida para proyectos */
        element: <ProtectedRoute />,
        children: [
          {
            path: "registerform",
            element: <RegisterForm />,
          },
          {
            path: "dashboard",
            element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
          },
          {
            path: "projects",
            element: <ProtectedRoute />,
            children: [
              {
                index: true,
                element: <Projects />,
              },
              {
                path: "nuevo",
                element: <NewProject />,
              },
            ],
          },
          {
            path: '/projects/:projectId',
            element: <ProjectDetail />
          },
          {
            path: "users",
            element: <ProtectedRoute adminOnly={true} />,
            children: [
              {
                index: true,
                element: <UserManagement />,
              },
            ],
          },
          {
            path: "roles/create",
            element: <CreateRole />
          },
          {
            path: "roles",
            element: <RolesManagement />
          }
        ],
      },
    ],

  },
]);