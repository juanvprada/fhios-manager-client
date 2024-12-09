import React, { useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../store/store";
import axios from "axios";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = useStore((state) => state.token);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const projectsData = response.data.data || [];
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  // Filtrar y ordenar proyectos
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(project => 
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenar por fecha
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return result;
  }, [projects, searchTerm, sortOrder]);

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
    <div className="p-6 md:ml-64 flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center font-poppins font-bold text-primary-500 mb-4">
        Proyectos
      </h1>
      <br />
      {/* Botón para crear nuevo proyecto */}
      <div className="w-full max-w-xl flex justify-end mb-4">
        <Link
          to="/proyectos/nuevo"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-poppins hover:bg-blue-600 transition-colors"
        >
          Crear Nuevo Proyecto
        </Link>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-xl">
        <input
          type="text"
          placeholder="Buscar proyectos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="asc">Más antiguos primero</option>
          <option value="desc">Más recientes primero</option>
        </select>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {filteredAndSortedProjects.length > 0 ? (
          filteredAndSortedProjects.map((project) => (
            <div
              key={project.project_id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
            >
              <h2 className="text-lg font-poppins font-semibold text-primary-500">
                {project.project_name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{project.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Metodología: {project.methodology}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No se encontraron proyectos
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;