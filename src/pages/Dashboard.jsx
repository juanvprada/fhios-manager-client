import React, { useState, useEffect } from 'react';
import useStore from '../store/store';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = useStore((state) => state.user);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Obtener datos del usuario si no están disponibles
        if (!user || !user.first_name) {
          const userResponse = await axios.get('http://localhost:5000/api/auth/profile');
          if (userResponse.data.data && isMounted) {
            login(userResponse.data.data);
          }
        }

        // Obtener proyectos y tareas
        const [projectsResponse, tasksResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/projects'),
          axios.get('http://localhost:5000/api/tasks')
        ]);

        if (isMounted) {
          setProjects(projectsResponse.data.data || []);
          setTasks(tasksResponse.data.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error:', err);
          setError('Error al cargar los datos');
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []); // Solo se ejecuta al montar el componente

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.name || 'Usuario'}
          </h1>
          {user?.email && (
            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resumen de Proyectos */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Mis Proyectos</h2>
              <div className="space-y-4">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="border-l-4 border-red-500 p-4 bg-gray-50"
                    >
                      <h3 className="font-medium">{project.project_name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <span className="text-xs text-gray-500">
                        Estado: {project.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No hay proyectos disponibles</p>
                )}
              </div>
            </div>
          </div>

          {/* Tareas Pendientes */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tareas Pendientes</h2>
              <div className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center p-4 bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex mt-2 space-x-4">
                          <span className="text-xs text-gray-500">
                            Prioridad: {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            Fecha límite: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'pending' ? 'bg-yellow-500' :
                        task.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No hay tareas pendientes</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats/Métricas */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-red-500">
                    {projects.length}
                  </span>
                  <p className="text-sm text-gray-600">Proyectos Activos</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-red-500">
                    {tasks.filter(t => t.status === 'pending').length}
                  </span>
                  <p className="text-sm text-gray-600">Tareas Pendientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;