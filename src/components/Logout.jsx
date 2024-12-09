// src/components/Logout.jsx
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  // Importar la notificación

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes borrar el token de autenticación o cualquier otro dato
    localStorage.removeItem("authToken");

    toast.success("Has cerrado sesión.");
    navigate("/"); // Redirige al login o a la página de inicio
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-custom-red text-black rounded-md mt-4 hover: bg-red-700 transition-colors"
    >
      Cerrar sesión
    </button>
  );
};

export default Logout;
