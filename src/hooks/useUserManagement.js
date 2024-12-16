import { useState, useEffect } from 'react';
import { getUsers, getAllUserRoles } from '../services/usersServices';
import useStore from '../store/store';
import axios from 'axios';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useStore(state => state.token);
  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !token) {
        setError("No estás autenticado");
        return;
      }

      try {
        setLoading(true);
        const [usersData, rolesData] = await Promise.all([
          getUsers(),
          getAllUserRoles()
        ]);

        // Mapear usuarios con sus nombres completos
        const formattedUsers = usersData.map(user => ({
          ...user,
          id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          role: rolesData.find(role => role.user_id === user.user_id)?.role_name || 'Sin rol'
        }));

        setUsers(formattedUsers);
        setError(null);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError(error.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  const filteredUsers = users?.filter((user) =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Manejar cambios de rol
  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedUser = await updateUser(userId, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: updatedUser.role } : user
        )
      );
      setShowRoleModal(false);
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
    }
  };

  // Manejar eliminación de usuarios
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);

      
      setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      // Preparar los datos para la actualización
      const updateData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        status: userData.status
      };
  
      // Si hay una nueva contraseña, la incluimos
      if (userData.password) {
        updateData.password = userData.password;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/users/${userData.user_id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      // Actualizar la lista de usuarios
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userData.user_id 
            ? { ...user, ...response.data.data }
            : user
        )
      );
  
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  };
  
  // Agregar handleUpdateUser al return del hook
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
    showDeleteModal,
    setShowDeleteModal,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    handleUpdateUser, // Agregar esta línea
    loading,
    error
  };
};

export default useUserManagement;