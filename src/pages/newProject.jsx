import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from '../store/store';
import { createProject } from '../services/projectServices';
import axios from 'axios';

const NewProject = () => {
  const navigate = useNavigate();
  const { token } = useStore();
  const { user } = useStore();


  // Estados
  const [projectName, setProjectName] = useState("");
  const [duration, setDuration] = useState({ start: "", end: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [methodology, setMethodology] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Función para obtener usuarios
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setFetchError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setFetchError('Error al cargar los usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!token) {
      console.log('No token found');
      navigate('/login');
      return;
    }
    console.log('Token found:', token);
    fetchUsers();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    try {
      const projectData = {
        project_name: projectName,
        description,
        methodology: methodology.toUpperCase(),
        start_date: duration.start,
        end_date: duration.end,
        status: 'planning',
        selectedUsers: selectedUsers.map((id) => id.toString()),
        created_by: user.user_id,
      };

      console.log("Datos enviados al backend:", projectData);

      await createProject(projectData);
      navigate("/projects");
    } catch (err) {
      console.error("Error al crear el proyecto:", err);
      setSubmitError(err.response?.data?.message || "Error al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-xl w-full p-6 sm:p-8 box-border">
        <h1 className="text-2xl text-center font-poppins font-bold text-primary-500 mb-4">
          Crear Nuevo Proyecto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Proyecto */}
          <div>
            <label className="block text-sm font-medium text-primary-500 mb-2">
              Nombre del Proyecto:
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ingrese el nombre del proyecto"
              required
            />
          </div>

          {/* Duración del Proyecto */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-primary-500 mb-2">
                Fecha de Inicio:
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
                value={duration.start}
                onChange={(e) => setDuration({ ...duration, start: e.target.value })}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-primary-500 mb-2">
                Fecha de Fin:
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
                value={duration.end}
                onChange={(e) => setDuration({ ...duration, end: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Metodología */}
          <div>
            <label className="block text-sm font-medium text-primary-500 mb-2">
              Metodología:
            </label>
            <select
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="SCRUM">Scrum</option>
              <option value="KANBAN">Kanban</option>
              <option value="WATERFALL">Waterfall</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-primary-500 mb-2">
              Descripción:
            </label>
            <textarea
              className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-primary-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del proyecto"
              rows="4"
            />
          </div>

          {/* Selección de Usuarios */}
          <div>
            <label className="block text-sm font-medium text-primary-500 mb-2">
              Seleccionar Miembros del Equipo:
            </label>
            {loadingUsers ? (
              <div className="text-gray-500">Cargando usuarios...</div>
            ) : (
              <>
                <div className="border border-gray-300 rounded-lg w-full p-3 max-h-[300px] overflow-y-auto">
                  {Array.isArray(users) && users.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center p-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        id={`user-${user.user_id}`}
                        value={user.user_id}
                        checked={selectedUsers.includes(user.user_id.toString())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, e.target.value]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== e.target.value));
                          }
                        }}
                        className="mr-3"
                      />
                      <label htmlFor={`user-${user.user_id}`}>
                        {`${user.first_name} ${user.last_name}`}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Lista de usuarios seleccionados */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-primary-500 mb-2">
                    Usuarios seleccionados ({selectedUsers.length}):
                  </h3>
                  <ul className="list-disc pl-5 text-secondary-700 space-y-1">
                    {selectedUsers.length === 0 ? (
                      <li>No hay usuarios seleccionados</li>
                    ) : (
                      selectedUsers.map((userId) => {
                        const user = users.find(
                          (u) => u.user_id.toString() === userId
                        );
                        return (
                          <li key={userId} className="flex justify-between items-center">
                            <span>
                              {user ? `${user.first_name} ${user.last_name}` : "Usuario desconocido"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUsers(selectedUsers.filter(id => id !== userId));
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Mensajes de error */}
          {(fetchError || submitError) && (
            <div className="text-red-500 text-sm">
              {fetchError || submitError}
            </div>
          )}

          {/* Botón para crear el proyecto */}
          <button
            type="submit"
            disabled={loading || loadingUsers}
            className="w-full bg-blue-500 text-white font-poppins py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Creando proyecto..." : "Crear Proyecto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProject;