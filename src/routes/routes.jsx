import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";

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
        path: "proyectos",
        element: <Projects />,
      },
      
      {
        path: "usuarios",
        element: <h1 className="text-2xl font-poppins">Gestión de Usuarios</h1>,
      },
    ],
  },
]);




