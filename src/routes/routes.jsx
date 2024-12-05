import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Projects from "../pages/Projects";
import UserManagement from "../pages/UserManagement";
import NewProject from "../pages/newProject";
import RegisterForm from "../pages/RegisterForm";

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
        path: "registerform",
        element: <RegisterForm />,
      },
      {
        path: "proyectos",
        element: <Projects />,
      },
      {
        path: "proyectos/nuevo",
        element: <NewProject /> ,
      },
      {
        path: "usuarios",
        element: <UserManagement />,
      },
    ],
  },
]);




