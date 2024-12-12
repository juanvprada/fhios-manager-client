import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFilteredProjects from "../hooks/useFilteredProjects";
import { getProjects } from "../services/projectServices";
import useStore from '../store/store';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const token = useStore(state => state.token);

  // Hook para filtrar y ordenar
  const { filteredProjects } = useFilteredProjects(projects, searchTerm, sortOrder);

  // Cargar proyectos desde el backend al montar el componente
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isAuthenticated || !token) {
        setError("No estás autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
        setError(null);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
        setError(
          error.response?.data?.message || 
          "Error al cargar los proyectos. Por favor, intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, token]);

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="p-6 md:ml-64 flex justify-center items-center">
        <p>Cargando proyectos...</p>
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
          <p className="text-gray-500 col-span-full text-center">
            No se encontraron proyectos.
          </p>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.project_id}
              className="p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white cursor-pointer"
              onClick={() => handleProjectClick(project.project_id)}
            >
              <h2 className="text-lg font-poppins font-semibold text-primary-500">
                {project.project_name}
              </h2>
              <p className="text-sm text-secondary-700">
                Creado el: {new Date(project.created_at).toLocaleDateString()} por{" "}
                {project.created_by || "Desconocido"}
              </p>
              <p className="text-sm text-secondary-700">
                Metodología: {project.methodology}
              </p>
              <p className="text-sm text-secondary-700">
                Estado: {project.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;




