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
      // Convertir la string de usuarios separada por comas a un array
      const userIds = taskData.assigned_to.split(',');

      // Preparar la tarea con el formato correcto
      const modifiedTaskData = {
        project_id: projectId,
        ...taskData,
        assigned_to: userIds[0], // Usar el primer usuario como assigned_to principal
        assignedUsers: userIds.join('|'),
        description: `${taskData.description || ''}\n<!--ASSIGNED_USERS:${userIds.join('|')}-->`
      };

      // Crear la tarea
      const newTask = await createTask(projectId, modifiedTaskData);

      // Procesar la tarea para mostrar correctamente los usuarios asignados
      const processedTask = {
        ...newTask,
        description: newTask.description.replace(/<!--ASSIGNED_USERS:.*?-->/, '').trim(),
        assignedUsers: userIds
      };

      setTasks(prevTasks => [...prevTasks, processedTask]);
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-6 pb-16">
        <div className="md:ml-64">
          <div className="max-w-6xl mx-auto">
            {/* Header con navegación */}
            <div className="sticky top-0 z-10 flex items-center mb-6 bg-gray-50 py-4">
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
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
              {/* Información General y Estado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Información General
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="w-5 h-5 mr-3 text-primary-500" />
                      <span>Creado el: {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="w-5 h-5 mr-3 text-primary-500" />
                      <span>Creado por: {project.created_by || "Desconocido"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiFlag className="w-5 h-5 mr-3 text-primary-500" />
                      <span>Metodología: {project.methodology}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Estado del Proyecto
                  </h2>
                  <div className="space-y-4">
                    {project.start_date && project.end_date && (
                      <div className="bg-blue-50 text-blue-800 px-6 py-4 rounded-xl shadow-sm">
                        <div className="text-sm font-medium mb-1">Días hábiles restantes</div>
                        <div className="text-2xl font-bold">{businessDays}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {project.start_date && project.end_date && (
                        <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                          <div className="mr-6">
                            <div className="text-sm font-medium text-gray-500 mb-1">Fecha de inicio</div>
                            <div className="text-gray-900">{new Date(project.start_date).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Fecha de finalización</div>
                            <div className="text-gray-900">{new Date(project.end_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Descripción
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600">
                    {project.description || "No hay descripción disponible."}
                  </p>
                </div>
              </div>

              {/* Sección de Tareas */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
                    Tareas del Proyecto
                  </h2>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Nueva Tarea
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl">
                  {tasks.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No hay tareas creadas aún.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <div
                          key={task.task_id}
                          className="p-4 sm:p-6 hover:bg-white transition-colors duration-200 cursor-pointer rounded-lg"
                          onClick={() => navigate(`/projects/${projectId}/tasks/${task.task_id}`)}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h3>
                              <p className="text-sm text-gray-600">{task.description}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full self-start
                                ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'}`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiCalendar className="w-4 h-4 mr-2" />
                              <span>{new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                            {task.assignedUsers && (
                              <div className="flex flex-wrap items-center">
                                <span className="mr-2">Asignado a:</span>
                                {task.assignedUsers.map((userId, index) => {
                                  const user = availableUsers.find(u => u.user_id.toString() === userId);
                                  return (
                                    <span key={userId} className="mr-1">
                                      {user?.name}
                                      {index < task.assignedUsers.length - 1 ? ',' : ''}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
}
export default ProjectDetail;