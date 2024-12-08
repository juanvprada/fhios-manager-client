import { useState, useEffect } from 'react';
import { getUsers, getAllUserRoles } from '../services/usersServices';
import useStore from '../store/store';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = useStore(state => state.isAuthenticated);
  const token = useStore(state => state.token);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !token) {
        setError("No estás autenticado");
        setLoading(false);
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
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
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
    error
  };
};

export default useUserManagement;
