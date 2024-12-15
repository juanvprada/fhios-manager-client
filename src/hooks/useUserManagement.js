import { useState, useEffect, useCallback } from 'react';
import { assignUserRole, removeUserRole } from '../services/usersServices';
import useStore from '../store/store';
import axios from 'axios';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const token = useStore(state => state.token);

  const API_URL = 'http://localhost:3000';

  const getHeaders = useCallback(() => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  const fetchData = useCallback(async () => {
    try {
      if (!token) {
        setError("No estás autenticado");
        return;
      }

      setLoading(true);
      const [usersResponse, rolesResponse, userRolesResponse] = await Promise.all([
        axios.get(`${API_URL}/users`, getHeaders()),
        axios.get(`${API_URL}/roles`, getHeaders()),
        axios.get(`${API_URL}/user_roles`, getHeaders()),
      ]);

      const usersData = usersResponse.data || [];
      const rolesData = rolesResponse.data || [];
      const userRolesData = userRolesResponse.data || [];

      const rolesMap = rolesData.reduce((acc, role) => {
        acc[role.role_id] = role.role_name;
        return acc;
      }, {});

      const usersWithRoles = usersData.map(user => {
        const userRole = userRolesData.find(ur => ur.user_id === user.user_id);
        return {
          ...user,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: userRole ? rolesMap[userRole.role_id] : 'Sin rol',
          role_id: userRole?.role_id,
          created_at: user.created_at,
          status: user.status,
        };
      });

      setUsers(usersWithRoles);
      setRoles(rolesData);
      setError(null);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredUsers = users?.filter((user) =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleRoleChange = async (userId, roleId, action = 'assign') => {
    try {
      if (action === 'assign') {
        await assignUserRole(userId, roleId);
      } else if (action === 'remove') {
        await removeUserRole(userId, roleId);
      }

      const response = await axios.get(`${API_URL}/api/roles/user/${userId}`, getHeaders());
      const updatedRoles = response.data?.data || response.data || [];

      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.user_id === userId) {
            return {
              ...user,
              role: updatedRoles.map(role => role.role_name).join(', ') || 'Sin rol',
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

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError('No se pudo eliminar el usuario de la lista. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
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
    showDeleteModal,
    setShowDeleteModal,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    loading,
    error,
    roles,
  };
};

export default useUserManagement;
