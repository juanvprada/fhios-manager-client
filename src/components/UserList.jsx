import { useState, useEffect } from "react";
import axios from "axios";
import useStore from "../store/store";

// Componente Modal para Editar Usuario
const EditUserModal = ({
  user,
  roles = [],
  userRoles,
  isOpen,
  onClose,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    status: "active",
    roles: [],
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (user && isOpen) {
      // Obtener los roles actuales del usuario
      const currentUserRoles = Array.isArray(userRoles[user.user_id]) 
        ? userRoles[user.user_id] 
        : [];
      
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        status: user.status || "active",
        roles: currentUserRoles,
      });
    }
  }, [user, userRoles, isOpen]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en los roles
  const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value);

    if (!roleId) {
      setFormData((prev) => ({
        ...prev,
        roles: [],
      }));
      return;
    }

    const selectedRole = roles.find((role) => role.role_id === roleId);
    if (selectedRole) {
      setFormData((prev) => ({
        ...prev,
        roles: [selectedRole],
      }));
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Editar Usuario: {user?.first_name} {user?.last_name}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rol
              </label>
              <select
                value={formData.roles[0]?.role_id || ""}
                onChange={handleRoleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccione un rol</option>
                {Array.isArray(roles) &&
                  roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
              </select>
              {formData.roles[0] && (
                <p className="mt-2 text-sm text-gray-600">
                  Rol actual: {formData.roles[0].role_name}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
// Componente Modal para Confirmar Eliminación
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Confirmar Eliminación
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          ¿Estás seguro que deseas eliminar este usuario? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Principal UsersList
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const token = useStore((state) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Obtener roles primero
        const rolesResponse = await axios.get(
          "http://localhost:3000/api/roles",
          config
        );
        setRoles(rolesResponse.data || []);

        // Obtener usuarios
        const usersResponse = await axios.get(
          "http://localhost:3000/api/users",
          config
        );
        const userData = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.data;
        setUsers(userData || []);

        // Obtener roles de cada usuario
        const userRolesData = {};
        for (const user of userData) {
          try {
            const userRolesResponse = await axios.get(
              `http://localhost:3000/api/roles/user/${user.user_id}`,
              config
            );
            console.log(
              `Roles for user ${user.user_id}:`,
              userRolesResponse.data
            ); // Para debug
            userRolesData[user.user_id] = userRolesResponse.data.data || [];
          } catch (error) {
            console.error(
              `Error fetching roles for user ${user.user_id}:`,
              error
            );
            userRolesData[user.user_id] = [];
          }
        }
        setUserRoles(userRolesData);
      } catch (err) {
        console.error("Error detallado:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleEdit = async (updatedData) => {
    try {
      const { roles, ...userData } = updatedData;

      // Actualizar información del usuario
      await axios.put(
        `http://localhost:3000/api/users/${selectedUser.user_id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar o asignar rol
      if (roles.length > 0) {
        try {
          // Verificar si el usuario ya tiene roles asignados
          const currentUserRoles = userRoles[selectedUser.user_id] || [];

          if (currentUserRoles.length > 0) {
            // Si ya tiene roles, usar PUT para actualizar
            await axios.put(
              `http://localhost:3000/api/roles/user/${selectedUser.user_id}`,
              {
                roles: [roles[0].role_id],
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            // Si no tiene roles, usar POST para asignar
            await axios.post(
              `http://localhost:3000/api/roles`,
              {
                user_id: selectedUser.user_id,
                role_id: roles[0].role_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
        } catch (roleError) {
          console.error("Error actualizando rol:", roleError);
          alert(
            "Información del usuario actualizada pero hubo un error con el rol"
          );
        }
      }

      // Recargar datos
      await fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert(
        "Error al actualizar usuario: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  // También aplicar la misma lógica para la creación de usuarios
  const handleCreate = async (userData) => {
    try {
      // Crear usuario
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: userData.email,
          password: userData.password,
          first_name: userData.first_name,
          last_name: userData.last_name,
          status: userData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userId = response.data.data?.user_id;

      // Asignar rol usando POST ya que es un usuario nuevo
      if (userData.roles.length > 0 && userId) {
        try {
          await axios.post(
            `http://localhost:3000/api/roles`,
            {
              user_id: userId,
              role_id: userData.roles[0].role_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (roleError) {
          console.error("Error asignando rol:", roleError);
          alert("Usuario creado pero hubo un error asignando el rol");
        }
      }

      // Recargar datos
      await fetchData();
      setIsCreateModalOpen(false);
      alert("Usuario creado exitosamente");
    } catch (error) {
      console.error("Error creating user:", error);
      alert(
        "Error al crear el usuario: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Obtener usuarios y roles en paralelo
      const [usersResponse, rolesResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/users", config),
        axios.get("http://localhost:3000/api/roles", config),
      ]);

      setUsers(usersResponse.data || []);
      setRoles(rolesResponse.data || []);

      // Obtener roles de cada usuario
      const userRolesData = {};
      for (const user of usersResponse.data) {
        try {
          const userRolesResponse = await axios.get(
            `http://localhost:3000/api/roles/user/${user.user_id}`,
            config
          );
          // Asegurarnos de que siempre sea un array
          userRolesData[user.user_id] = Array.isArray(userRolesResponse.data)
            ? userRolesResponse.data
            : Array.isArray(userRolesResponse.data.data)
            ? userRolesResponse.data.data
            : [];
        } catch (error) {
          console.error(
            `Error fetching roles for user ${user.user_id}:`,
            error
          );
          userRolesData[user.user_id] = [];
        }
      }
      setUserRoles(userRolesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error al cargar los datos");
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/users/${selectedUser.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(users.filter((user) => user.user_id !== selectedUser.user_id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Usuarios</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Nuevo Usuario
        </button>
      </div>

      {users && users.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Roles
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id || user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {`${user.first_name || ""} ${user.last_name || ""}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status || "Desconocido"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          No hay usuarios para mostrar
        </div>
      )}

      <EditUserModal
        user={selectedUser}
        roles={roles}
        userRoles={userRoles}
        isOpen={isEditModalOpen}
        onClose={() => {
          setSelectedUser(null);
          setIsEditModalOpen(false);
        }}
        onSave={handleEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        roles={roles}
        onSave={handleCreate}
      />
    </div>
  );
};

export default UsersList;

const CreateUserModal = ({ isOpen, onClose, roles, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "", // Agregamos campo de contraseña para nuevo usuario
    status: "active",
    roles: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value);

    if (!roleId) {
      setFormData((prev) => ({
        ...prev,
        roles: [],
      }));
      return;
    }

    const selectedRole = roles.find((role) => role.role_id === roleId);
    if (selectedRole) {
      setFormData((prev) => ({
        ...prev,
        roles: [selectedRole],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        status: "active",
        roles: [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Crear Nuevo Usuario
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rol
              </label>
              <select
                value={formData.roles[0]?.role_id || ""}
                onChange={handleRoleChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccione un rol</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

UserList.propTypes = {
  user: PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
  }).isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default UserList;