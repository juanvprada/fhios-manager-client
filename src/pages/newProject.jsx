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
      navigate('/login');
      return;
    }
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
    <div className="flex justify-center items-start min-h-screen bg-gray-50 overflow-x-hidden p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-lg">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
            <div>
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
