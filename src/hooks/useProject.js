import { useState, useEffect } from 'react';
import { getProjects, createProject, assignUserToProject } from '../services/projectServices';
import useStore from '../store/store';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createError, setCreateError] = useState(null);

  const isAuthenticated = useStore(state => state.isAuthenticated);
  const token = useStore(state => state.token);

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
      } catch (err) {
        console.error("Error al cargar proyectos:", err);
        setError(err.response?.data?.message || "Error al cargar los proyectos");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, token]);

  const handleCreateProject = async (projectData) => {
    setLoading(true);
    setCreateError(null);
    try {
      const formattedData = {
        project_name: projectData.projectName,
        methodology: projectData.methodology.toUpperCase(),
        start_date: projectData.duration.start,
        end_date: projectData.duration.end,
        status: 'planning',
        description: projectData.description || ''
      };

      const newProject = await createProject(formattedData);

      if (projectData.selectedUsers?.length > 0) {
        const projectMemberPromises = projectData.selectedUsers.map(userId =>
          assignUserToProject(newProject.project_id, userId)
        );
        await Promise.all(projectMemberPromises);
      }

      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el proyecto';
      setCreateError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filtrar y ordenar proyectos
  const filteredProjects = projects
    .filter((project) =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return {
    projects,
    filteredProjects,
    loading,
    error: error || createError,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    handleCreateProject
  };
};

export default useProjects;