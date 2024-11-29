import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";
import GestionUsuarios from "../pages/GestionUsuarios";

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
        path: "nuevo-proyecto",
        element: (
          <h1 className="text-2xl font-poppins">
            Formulario para crear un nuevo proyecto
          </h1>
        ),
      },
      {
        path: "usuarios",
        element: <GestionUsuarios />,
      },
    ],
  },
]);




