// src/pages/ProfilePage.jsx
import ChangePassword from "../components/ChangePassword";
import Logout from "../components/Logout";

const ProfilePage = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-poppins text-center text-custom-red mb-6">Perfil</h2>
      
      {/* Aquí agregamos el formulario de cambio de contraseña */}
      <ChangePassword />
      
      {/* Aquí el botón de logout */}
      <Logout />
    </div>
  );
};

export default ProfilePage;
