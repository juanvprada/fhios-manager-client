import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../services/usersServices';
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
        const userData = await getUsers();
        setUsers(userData);
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

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedRole = await updateUserRole(userId, newRole);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
  
      setShowRoleModal(false);
    } catch (error) {
      console.error('Error en gestión de roles:', error);
      throw new Error(error.response?.data?.message || 'Error al gestionar el rol');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
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
    userRoles,
    users
  };
};

export default useUserManagement;