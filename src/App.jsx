// src/App.jsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Importar estilos

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";  // Ruta de las configuraciones de las rutas

function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />  {/* Contenedor para las notificaciones */}
    </div>
  );
}

export default App;
