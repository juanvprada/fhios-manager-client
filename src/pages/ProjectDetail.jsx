import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById } from '../services/projectServices';
import { getProjectTasks, createTask } from '../services/taskServices';
import { getUsers } from '../services/usersServices';
import useStore from '../store/store';
import { FiArrowLeft, FiCalendar, FiUsers, FiFlag, FiPlus } from 'react-icons/fi';
import TaskForm from '../components/TaskForm';

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const token = useStore(state => state.token);

  // Función para calcular días hábiles
  const calculateBusinessDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    while (start <= end) {
      const dayOfWeek = start.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      start.setDate(start.getDate() + 1);
    }

    return count;
  };

  const fetchData = async () => {
    if (!isAuthenticated || !token) {
      setError("No estás autenticado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [projectData, tasksData, usersData] = await Promise.all([
        getProjectById(projectId),
        getProjectTasks(projectId),
        getUsers()
      ]);

      setProject(projectData);
      setTasks(tasksData);
      setAvailableUsers(usersData);
      setError(null);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setError(
        error.response?.data?.message ||
        "Error al cargar los datos del proyecto. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, isAuthenticated, token]);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(projectId, taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:ml-64 flex justify-center items-center">
        <p>Cargando proyecto...</p>
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

  if (!project) {
    return (
      <div className="p-6 md:ml-64 flex justify-center items-center">
        <p>Proyecto no encontrado</p>
      </div>
    );
  }

  // Calcular días hábiles restantes
  const businessDays = project.start_date && project.end_date
    ? calculateBusinessDays(project.start_date, project.end_date)
    : null;

  return (
    <div className="p-6 md:ml-64">
      {/* Header con navegación */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-poppins font-bold text-primary-500">
          {project.project_name}
        </h1>
      </div>

      {/* Información del Proyecto */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información General
            </h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="w-5 h-5 mr-2" />
                <span>Creado el: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUsers className="w-5 h-5 mr-2" />
                <span>Creado por: {project.created_by || "Desconocido"}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiFlag className="w-5 h-5 mr-2" />
                <span>Metodología: {project.methodology}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Estado del Proyecto
            </h2>
            <div className="space-y-3">
              {project.start_date && project.end_date && (
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-md w-auto">
                  <span className="text-lg font-bold">
                    Días hábiles para terminarlo:
                  </span>
                  <span className="ml-2 text-xl font-extrabold">{businessDays}</span>
                </div>
              )}
              {project.start_date && (
                <div className="text-gray-600">
                  Fecha de inicio: {new Date(project.start_date).toLocaleDateString()}
                </div>
              )}
              {project.end_date && (
                <div className="text-gray-600">
                  Fecha de finalización: {new Date(project.end_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Descripción
          </h2>
          <p className="text-gray-600">
            {project.description || "No hay descripción disponible."}
          </p>
        </div>

        {/* Sección de Tareas */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tareas del Proyecto
            </h2>
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <FiPlus className="w-4 h-4" />
              Nueva Tarea
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            {tasks.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">
                No hay tareas creadas aún.
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div key={task.task_id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      {task.assigned_to && (
                        <span className="ml-4">
                          Asignado a: {availableUsers.find(u => u.user_id === task.assigned_to)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Nueva Tarea */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
          availableUsers={availableUsers}
        />
      )}
    </div>
  );
};

export default ProjectDetail;