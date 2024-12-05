import { createBrowserRouter } from 'react-router-dom';
import Layout from "../layout/Layout.jsx";
import Home from '../pages/Home.jsx';
import Profile from '../assets/Profile.jsx'; // Importa el componente

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'profile', element: <Profile /> }, // Ruta para el perfil
    ],
  },
]);
