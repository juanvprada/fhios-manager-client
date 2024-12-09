import React from "react";
import { useNavigate, Link } from "react-router-dom";
import useProjects from "../hooks/useProject";

const Projects = () => {
  const navigate = useNavigate();
  const {
    filteredProjects,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder
  } = useProjects();

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="p-6 md:ml-64 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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
    <div className="p-6 md:ml-64 flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center font-poppins font-bold text-primary-500 mb-4">
        Proyectos
      </h1>
      <br />

      {/* Controles de Búsqueda y Orden */}
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

      {/* Lista de Proyectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {filteredProjects.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No se encontraron proyectos.
          </p>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.project_id}
              onClick={() => handleProjectClick(project.project_id)}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white cursor-pointer"
            >
              <h2 className="text-lg font-poppins font-semibold text-primary-500">
                {project.project_name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {project.description || 'Sin descripción'}
              </p>
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
        )}
      </div>
    </div>
  );
};

export default Projects;




