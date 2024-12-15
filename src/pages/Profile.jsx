import React from 'react';
import useProfile from '../hooks/useProfile';
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm';

const Profile = () => {
  const navigate = useNavigate();
  
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    loading,
    handlePasswordUpdate
  } = useProfile();

  const user = useStore(state => state.user);

  // Modificar handlePasswordUpdate para incluir redirección
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handlePasswordUpdate(e);

    if (success) {
      navigate('/projects');
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-xl sm:text-2xl text-center font-poppins font-bold text-primary-500 mb-4 px-2">
          Mi Perfil
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Información del usuario */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Información Personal
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Rol:</span>
                <span className="font-medium">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${user?.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user?.role}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Aquí usamos el componente separado */}
          <ChangePasswordForm
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordUpdate={handleSubmit}
            error={error}
            success={success}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
