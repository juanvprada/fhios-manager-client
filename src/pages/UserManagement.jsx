import React from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck } from 'react-icons/fi';
import useUserManagement from '../hooks/useUserManagement';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const UserManagement = () => {
  const {
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
    roles
  } = useUserManagement();

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-4">
        <h1 className="text-xl sm:text-2xl text-center font-poppins font-bold text-primary-500 mb-4 px-2">
          Gestión de Usuarios
        </h1>

        {/* Controles de búsqueda y ordenamiento */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-xl mx-auto px-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="asc">Más antiguos primero</option>
            <option value="desc">Más recientes primero</option>
          </select>
        </div>

        {/* Vista móvil (tarjetas) */}
        <div className="md:hidden w-full space-y-4 px-2">
          {filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="bg-white p-4 rounded-lg shadow-md space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRoleModal(true);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-900"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="p-1 text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "Project Manager"
                        ? "bg-green-100 text-green-800"
                        : user.role === "Tech Leader"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {user.role}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Vista escritorio (tabla) */}
        <div className="hidden md:block w-full">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Fecha de creación
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "Project Manager"
                                ? "bg-green-100 text-green-800"
                                : user.role === "Tech Leader"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal para cambiar rol */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cambiar rol de {selectedUser.name}
              </h3>
              <div className="space-y-4">
                {roles.map((role) => (
                  <button
                    key={role.role_id}
                    onClick={() => handleRoleChange(selectedUser.user_id, role.role_id)}
                    className={`w-full p-2 text-left rounded-lg flex items-center gap-2 transition-colors duration-200 
                      ${selectedUser.role === role.role_name ? 'bg-primary-50' : ''}
                      ${role.role_name.toLowerCase() === 'admin'
                        ? 'hover:bg-purple-50'
                        : role.role_name === 'Project Manager'
                          ? 'hover:bg-green-50'
                          : role.role_name === 'Tech Leader'
                            ? 'hover:bg-blue-50'
                            : 'hover:bg-gray-50'
                      }`}
                  >
                    <FiUserCheck
                      className={`
                        ${selectedUser.role === role.role_name ? 'text-primary-500' : ''}
                        ${role.role_name.toLowerCase() === 'admin'
                          ? 'text-purple-500'
                          : role.role_name === 'Project Manager'
                            ? 'text-green-500'
                            : role.role_name === 'Tech Leader'
                              ? 'text-blue-500'
                              : 'text-gray-400'
                        }
                      `}
                    />
                    {role.role_name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="mt-4 w-full bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          onConfirm={() => userToDelete && handleDeleteUser(userToDelete.user_id)}
          title="Eliminar Usuario"
          message={`¿Estás seguro de que deseas eliminar al usuario ${userToDelete?.name}? Esta acción no se puede deshacer.`}
        />
      </div>
    </div>
  );
};

export default UserManagement;
