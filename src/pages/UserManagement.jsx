import React from "react";
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiX } from "react-icons/fi";
import useUserManagement from "../hooks/useUserManagement";

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
    handleDeleteUser,
    loading,
    error,
    roles,
    userRoles,
  } = useUserManagement();

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
      <div className="p-6 md:ml-64 flex justify-center items-center">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:ml-64 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6  flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center font-poppins font-bold text-primary-500 mb-4">
        Gestión de Usuarios
      </h1>
      <br />

      {/* Controles de búsqueda y ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-xl">
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

      {/* Lista de Usuarios */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
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
                  key={user.id || user.user_id || Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(userRoles[user.user_id]) &&
                      userRoles[user.user_id].length > 0 ? (
                        userRoles[user.user_id].map((role) => (
                          <span
                            key={role.role_id}
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {role.role_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Sin rol asignado
                        </span>
                      )}
                    </div>
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
                        onClick={() =>
                          handleDeleteUser(user.id || user.user_id)
                        }
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

      {showRoleModal && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full mx-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Gestionar roles de {selectedUser.name}
      </h3>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Roles actuales:</h4>
        <div className="flex flex-wrap gap-2">
          {userRoles[selectedUser.user_id]?.map(role => (
            <div key={role.role_id} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm text-blue-800">{role.role_name}</span>
              <button
                onClick={async () => {
                  try {
                    await handleRoleChange(selectedUser.user_id, role.role_id, 'remove');
                    alert('Rol eliminado exitosamente');
                  } catch (error) {
                    alert(error.message);
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FiX />
              </button>
            </div>
          ))}
          {(!userRoles[selectedUser.user_id] || userRoles[selectedUser.user_id].length === 0) && (
            <span className="text-sm text-gray-500">Sin roles asignados</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Asignar nuevo rol:</h4>
        {roles
          .filter(role => 
            !userRoles[selectedUser.user_id]?.some(
              userRole => userRole.role_id === role.role_id
            )
          )
          .map(role => (
            <button
              key={role.role_id}
              onClick={async () => {
                try {
                  await handleRoleChange(selectedUser.user_id, role.role_id, 'assign');
                  alert('Rol asignado exitosamente');
                } catch (error) {
                  alert(error.message);
                }
              }}
              className="w-full p-2 text-left rounded-lg hover:bg-blue-50 flex items-center gap-2 transition-colors duration-200"
            >
              <FiUserCheck className="text-blue-500" />
              {role.role_name}
            </button>
          ))}
      </div>

      <button
        onClick={() => setShowRoleModal(false)}
        className="mt-4 w-full bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        Cerrar
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default UserManagement;
