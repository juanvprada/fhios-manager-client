import { useState, useEffect } from 'react';
import { createProject } from '../services/projectServices';
import useUserStore from '../store/userStore';
import useAuthStore from '../store/authStore';

export const useProject = () => {
  const { token } = useAuthStore();
  const { users, loading: loadingUsers, error, fetchUsers } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

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

      if (projectData.selectedUsers.length > 0) {
        const projectMemberPromises = projectData.selectedUsers.map(userId =>
          assignUserToProject(newProject.project_id, userId)
        );
        await Promise.all(projectMemberPromises);
      }

      return newProject;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el proyecto';
      setCreateError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    loadingUsers,
    error: error || createError,
    handleCreateProject
  };
};