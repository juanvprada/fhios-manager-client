import { useState, useEffect, useCallback } from 'react';
import { assignUserRole, removeUserRole } from '../services/usersServices';
import useStore from '../store/store';
import axios from 'axios';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);

  const token = useStore(state => state.token);
  const isAuthenticated = useStore(state => state.isAuthenticated); // Obtener del store

  const API_URL = 'http://localhost:3000';

  const getHeaders = useCallback(() => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  const fetchData = useCallback(async () => {  // Agregado useCallback aquí
    if (!isAuthenticated || !token) {
      setError("No estás autenticado");
      return;
    }

    try {
      setLoading(true);

      // Obtener roles disponibles
      const rolesResponse = await axios.get(`${API_URL}/api/roles`, getHeaders());
      console.log('Respuesta de roles:', rolesResponse.data);
      const rolesData = rolesResponse.data.data || rolesResponse.data || [];
      setRoles(rolesData);

      // Obtener usuarios
      const usersResponse = await axios.get(`${API_URL}/api/users`, getHeaders());
      const usersData = usersResponse.data.data || usersResponse.data || [];

      // Obtener roles específicos para cada usuario
      const userRolesData = {};
      await Promise.all(
        usersData.map(async (user) => {
          try {
            const response = await axios.get(`${API_URL}/api/roles/user/${user.user_id}`, getHeaders());
            userRolesData[user.user_id] = response.data.data || response.data || [];
          } catch (error) {
            console.error(`Error al obtener roles para usuario ${user.user_id}:`, error);
            userRolesData[user.user_id] = [];
          }
        })
      );
      
      setUserRoles(userRolesData);
      setUsers(usersData);
      setError(null);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, getHeaders]);  // Ahora fetchData está memoizada

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Usamos fetchData como dependencia

  const filteredUsers = users?.filter((user) =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Manejar cambios de rol
  const handleRoleChange = async (userId, roleId, action = 'assign') => {
    try {
      console.log('Gestionando rol:', { userId, roleId, action });

      if (action === 'assign') {
        await assignUserRole(userId, roleId);
      } else if (action === 'remove') {
        await removeUserRole(userId, roleId);
      }

      // Recargar roles del usuario
      const response = await axios.get(`${API_URL}/api/roles/user/${userId}`, getHeaders());

      const updatedRoles = response.data?.data || response.data || [];
      
      setUserRoles(prev => ({
        ...prev,
        [userId]: updatedRoles
      }));

      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.user_id === userId) {
            return {
              ...user,
              roles: updatedRoles,
              role: updatedRoles.map(role => role.role_name).join(', ') || 'Sin rol'
            };
          }
          return user;
        })
      );

      setShowRoleModal(false);
    } catch (error) {
      console.error('Error en gestión de roles:', error);
      throw new Error(error.response?.data?.message || 'Error al gestionar el rol');
    }
  };

  // Manejar eliminación de usuarios
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`, getHeaders());
      fetchData();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el usuario');
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
    handleDeleteUser,
    loading,
    error,
    roles,
    userRoles
  };
};

export default useUserManagement;
