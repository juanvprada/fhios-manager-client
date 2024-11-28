// src/components/ChangePassword.jsx
import { useState } from "react";
import { toast } from "react-toastify";  // Importar la notificación

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    // Aquí deberías agregar la lógica para actualizar la contraseña
    toast.success("Contraseña cambiada con éxito.");
    setError(""); // Limpia el error
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Cambiar Contraseña</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Contraseña actual
          </label>
          <input
            type="password"
            id="currentPassword"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
        type="submit"
        className="w-full py-2 bg-custom-red text-black rounded-md mt-4 hover:bg-red-700 transition-colors"
      >
        Cambiar contraseña
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
