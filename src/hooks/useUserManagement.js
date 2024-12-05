import { useState, useCallback } from "react";
import useFilteredUsers from './useFilteredUsers';

const useUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const { filteredUsers, updateUserRole, deleteUser } = useFilteredUsers(searchTerm, sortOrder);

  const handleRoleChange = useCallback((userId, newRole) => {
    updateUserRole(userId, newRole);
    setShowRoleModal(false);
  }, [updateUserRole]);

  const handleDeleteUser = useCallback((userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUser(userId);
    }
  }, [deleteUser]);

  return {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    selectedUser,
    setSelectedUser,
    showRoleModal,
    setShowRoleModal,
    filteredUsers,
    handleRoleChange,
    handleDeleteUser
  };
};

export default useUserManagement;