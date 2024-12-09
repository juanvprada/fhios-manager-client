import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store/store';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // Aquí está la definición que faltaba
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useStore(state => state.token);
  const API_URL = 'http://localhost:3000/api';

  const getHeaders = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  const fetchData = async () => {
    try {
      if (!token) {
        setError("No estás autenticado");
        return;
      }
  
      setLoading(true);
      const [usersResponse, rolesResponse, userRolesResponse] = await Promise.all([
        axios.get(`${API_URL}/users`, getHeaders()),
        axios.get(`${API_URL}/roles`, getHeaders()),
        axios.get(`${API_URL}/user_roles`, getHeaders())
      ]);
  
      console.log('Datos recibidos:', {
        users: usersResponse.data,
        roles: rolesResponse.data,
        userRoles: userRolesResponse.data
      });
  
      const usersData = usersResponse.data || [];
      const rolesData = rolesResponse.data || [];
      const userRolesData = userRolesResponse.data || [];
  
      // Crear un mapa de roles para búsqueda rápida
      const rolesMap = rolesData.reduce((acc, role) => {
        acc[role.role_id] = role.role_name;
        return acc;
      }, {});
  
      console.log('Mapa de roles:', rolesMap);
  
      // Combinar usuarios con sus roles
      const usersWithRoles = usersData.map(user => {
        const userRole = userRolesData.find(ur => ur.user_id === user.user_id);
        console.log('Procesando usuario:', {
          userId: user.user_id,
          foundUserRole: userRole,
          assignedRoleName: userRole ? rolesMap[userRole.role_id] : 'Sin rol'
        });
  
        return {
          ...user,
          user_id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: userRole ? rolesMap[userRole.role_id] : 'Sin rol',
          role_id: userRole?.role_id,
          created_at: user.created_at,
          status: user.status
        };
      });
  
      console.log('Usuarios procesados:', usersWithRoles);
  
      setRoles(rolesData);
      setUsers(usersWithRoles);
      setError(null);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  const filteredUsers = users?.filter((user) =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleRoleChange = async (userId, roleId) => {
    try {
      await axios.post(`${API_URL}/user_roles`, {
        user_id: userId,
        role_id: roleId
      }, getHeaders());

      await fetchData();
      setShowRoleModal(false);
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      throw new Error(error.response?.data?.message || 'Error al gestionar el rol');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`, getHeaders());
      await fetchData();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

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
    users
  };
};

export default useUserManagement;
