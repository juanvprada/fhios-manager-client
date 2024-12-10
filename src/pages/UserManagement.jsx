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
    handleUpdateUser
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Editar Usuario: {selectedUser.name}
            </h3>

            <div className="flex gap-8 m-4">

{/* Formulario de información del usuario */}
<div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Información Personal
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={selectedUser.first_name || ""}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={selectedUser.last_name || ""}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={selectedUser.email || ""}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Dejar en blanco para mantener la actual"
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={selectedUser.status || "active"}
                    onChange={(e) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección de Roles */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Roles Asignados
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {userRoles[selectedUser.user_id]?.map((role) => (
                  <div
                    key={role.role_id}
                    className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm text-blue-800">
                      {role.role_name}
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          await handleRoleChange(
                            selectedUser.user_id,
                            role.role_id,
                            "remove"
                          );
                          alert("Rol eliminado exitosamente");
                        } catch (error) {
                          alert(error.message);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!userRoles[selectedUser.user_id] ||
                  userRoles[selectedUser.user_id].length === 0) && (
                  <span className="text-sm text-gray-500">
                    Sin roles asignados
                  </span>
                )}
              </div>

              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Asignar Nuevo Rol
              </h4>
              <div className="space-y-2">
                {roles
                  .filter(
                    (role) =>
                      !userRoles[selectedUser.user_id]?.some(
                        (userRole) => userRole.role_id === role.role_id
                      )
                  )
                  .map((role) => (
                    <button
                      key={role.role_id}
                      onClick={async () => {
                        try {
                          await handleRoleChange(
                            selectedUser.user_id,
                            role.role_id,
                            "assign"
                          );
                          alert("Rol asignado exitosamente");
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
            </div>

            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    await handleUpdateUser(selectedUser);
                    alert("Usuario actualizado exitosamente");
                    setShowRoleModal(false);
                  } catch (error) {
                    alert("Error al actualizar usuario: " + error.message);
                  }
                }}
                className="px-4 py-2 text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
