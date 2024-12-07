import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";
import LoginForm from "../pages/LoginForm";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";


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
        path: "loginform",
        element: <LoginForm />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      }
    ],
  },
]);




