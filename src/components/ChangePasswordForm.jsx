import React from 'react';

const ChangePasswordForm = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordUpdate,
  error,
  success,
  loading
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Cambiar Contraseña
      </h2>
      <form onSubmit={handlePasswordUpdate} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
            Contraseña Actual
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-primary-200"
            placeholder="Ingresa tu contraseña actual"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
            Nueva Contraseña
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-primary-200"
            placeholder="Ingresa tu nueva contraseña"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-primary-200"
            placeholder="Confirma tu nueva contraseña"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-center mt-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-500 text-center mt-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
