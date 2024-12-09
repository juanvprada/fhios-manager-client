import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";
import UserManagement from "../pages/UserManagement";
import NewProject from "../pages/newProject";
import RegisterForm from "../pages/RegisterForm";
import LoginForm from "../pages/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import ProjectDetail from '../pages/ProjectDetail';
import TaskDetail from '../pages/TaskDetail';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <h1 className="text-2xl font-poppins"></h1>,
      },
      {
        path: "registerform",
        element: <RegisterForm />,
      },
      {
        path: "login",
        element: <LoginForm />,
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
        element: <ProtectedRoute><ProjectDetail /></ProtectedRoute>,
      },
      {
        path: '/projects/:projectId/tasks/:taskId',
        element: <ProtectedRoute><TaskDetail /></ProtectedRoute>,
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
    ],
  },
]);

function LogoutRoute() {
  const logout = useStore(state => state.logout);
  logout();
  return <Navigate to="/login" replace />;
}