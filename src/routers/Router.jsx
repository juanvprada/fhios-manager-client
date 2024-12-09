import { createBrowserRouter } from 'react-router-dom';
import Layout from "../layout/Layout.jsx";
import Home from '../pages/Home.jsx';
import Profile from '../components/Profile.jsx'; // Importa el componente

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // El Layout envolverá las páginas
    children: [
      { index: true, element: <Home /> },  // Ruta principal
      { path: 'profile', element: <Profile /> },  // Ruta para el perfil
    ],
  },
]);
