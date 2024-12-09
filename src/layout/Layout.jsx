import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar.jsx";
import { userService } from "../services/services";

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
    <div className="flex">
      <Sidebar  className=""/>
      <div className="flex-1  p-4 mt-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

