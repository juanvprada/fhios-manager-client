import { useState } from 'react';   
import { userService } from '../services'; // Importa el servicio de usuario

const Profile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Validación básica
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      setLoading(false);
      return;
    }

    try {
      // Llamada al servicio de cambio de contraseña
      await userService.changePassword(currentPassword, newPassword);
      setMessage('Contraseña cambiada exitosamente.');
      
      // Limpiar los campos de entrada
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6 text-primaryRed">
        Perfil de Usuario
      </h2>

      {/* Información del usuario */}
      <div className="mb-6 text-center">
        <p className="text-gray-700">Nombre: {userInfo.name || 'Usuario'}</p>
        <p className="text-gray-700">Email: {userInfo.email || 'usuario@ejemplo.com'}</p>
      </div>

      {/* Formulario de cambio de contraseña */}
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña Actual
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-primaryRed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-primaryRed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-primaryRed"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-500">{message}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md bg-primaryRed text-white ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Cargando...' : 'Cambiar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

