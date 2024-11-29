// hooks/useUserManagement.js
import { useState, useCallback } from "react";

const useUserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleDeleteUser = useCallback((userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      // Aquí irá la lógica de eliminación cuando tengamoss la BD
      console.log(`Eliminar usuario ${userId}`);
    }
  }, []);

  const handleRoleChange = useCallback((userId, newRole) => {
    // Aquí irá la lógica de actualización cuando tengamoss la BD
    console.log(`Cambiar rol del usuario ${userId} a ${newRole}`);
    setShowRoleModal(false);
  }, []);

  return {
    selectedUser,
    setSelectedUser,
    showRoleModal,
    setShowRoleModal,
    handleDeleteUser,
    handleRoleChange
  };
};

export default useUserManagement;