import React, { useState } from "react";
import { Link } from "react-router-dom"
import useFilteredProjects from "../hooks/useFilteredProjects";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { filteredProjects } = useFilteredProjects(searchTerm, sortOrder);

  return (
    <div className="p-6 md:ml-64 flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center font-poppins font-bold text-primary-500 mb-4">
        Proyectos
      </h1>
      <br />
       {/* Botón para crear nuevo proyecto */}
       <div className="w-full max-w-xl flex justify-end mb-4">
        <Link
          to="/proyectos/nuevo"  // Ruta correcta para navegar a NewProject
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-poppins hover:bg-blue-600 transition-colors"
        >
          Crear Nuevo Proyecto
        </Link>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 w-full max-w-xl">
        {/* Search */}
        <input
          type="text"
          placeholder="Buscar proyectos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="asc">Más antiguos primero</option>
          <option value="desc">Más recientes primero</option>
        </select>
      </div>

      {/* Project List in Canvas Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white cursor-pointer"
            onClick={() => console.log(`Open project: ${project.name}`)}
          >
            <h2 className="text-lg font-poppins font-semibold text-primary-500">
              {project.name}
            </h2>
            <p className="text-sm text-secondary-700">
              Creado el: {project.createdAt.toLocaleDateString()} por {project.creator}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;


