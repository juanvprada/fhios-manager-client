import { useState, useEffect } from 'react';
import { getUsers, getAllUserRoles, getUserRoles, assignUserRole, removeUserRole  } from '../services/usersServices';
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

  const isAuthenticated = useStore(state => state.isAuthenticated);
  const token = useStore(state => state.token);

  const getHeaders = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const API_URL = 'http://localhost:5000';
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !token) {
        setError("No estás autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Obtener roles disponibles - Corregida la ruta
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
    };

    fetchData();
  }, [isAuthenticated, token]);


  // Filtrar y ordenar usuarios
  const filteredUsers = users.filter((user) =>
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
      const response = await axios.get(
        `${API_URL}/api/roles/user/${userId}`,
        getHeaders()
      );
  
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
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
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
    handleDeleteUser,
    handleUpdateUser, // Agregar esta línea
    loading,
    error,
    roles,
    userRoles
  };
};

export default useUserManagement;