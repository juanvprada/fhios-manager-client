// routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";
import LoginForm from "../pages/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import UsersList from "../components/UserList";
import useStore from "../store/store";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <h1 className="text-2xl font-poppins">Inicio</h1>,
      },
      {
       /*  Ruta protegida para proyectos */
        element: <ProtectedRoute />,
        children: [
      {
        path: "proyectos",
        element: <Projects />,
      },
        ]
      },
      {
        /* Ruta protegida solo para admin */
        element: <ProtectedRoute adminOnly={true} />,
        children: [
          {
            path: "usuarios",
            element: <h1 className="text-2xl font-poppins">Gestión de Usuarios</h1>,
          },
        ]
      },
      {
        path: "logout",
        element: <LogoutRoute />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "Userlist",
        element: <UsersList />,
      }
    ],
  },
]);

function LogoutRoute() {
  const logout = useStore(state => state.logout);
  logout();
  return <Navigate to="/login" replace />;
}