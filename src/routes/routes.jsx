// routes.jsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";
import NewProject from "../pages/newProjects";

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
        path: "proyectos/nuevo",  
        element: <NewProject />,
      },
    ],
  },
]);





