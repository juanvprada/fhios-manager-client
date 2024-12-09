import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.jsx";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userService.logout(); // Llama al servicio de logout
      navigate("/"); // Redirige al inicio o a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      // Podrías mostrar una notificación o alerta aquí
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex mt-14">
        <Sidebar />
        <div className="flex-1 p-4 md:ml-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

