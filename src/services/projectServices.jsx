import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:3000/api/projects';

// Función auxiliar para obtener el token
const getAuthHeader = () => {
  const token = useStore.getState().token;
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const createProject = async (projectData) => {
  try {
    // Log para ver qué datos estamos enviando
    const dataToSend = {
      ...projectData,
      selectedUsers: projectData.selectedUsers,
    };

    const response = await axios.post(API_URL, dataToSend, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error en createProject:', error);
    throw error;
  }
};
export const getProjects = async () => {
  const response = await axios.get(API_URL, getAuthHeader());

  const users = await axios.get('http://localhost:3000/api/users', getAuthHeader());

  // Mapear IDs de usuarios a nombres
  const userMap = users.data.reduce((map, user) => {
    map[user.user_id] = `${user.first_name} ${user.last_name}`;
    return map;
  }, {});

  const cleanedProjects = response.data.map((project) => {
    const description = project.description || '';
    return {
      ...project,
      description: description.replace(/<!--ASSIGNED_USERS:.*?-->/, '').trim(),
      assignedUsers: description.match(/<!--ASSIGNED_USERS:(.*?)-->/)?.slice(1) || [],
      created_by_name: userMap[project.created_by],
    };
  });

  return cleanedProjects;
};

export const getProjectById = async (projectId) => {
  try {
    
    const response = await axios.get(`${API_URL}/${projectId}`, getAuthHeader());

    // Asegurarnos de que assignedUsers exista
    const projectData = {
      ...response.data,
      assignedUsers: response.data.selectedUsers || response.data.assignedUsers || []
    };

    return projectData;
  } catch (error) {
    console.error('Error en getProjectById:', error);
    throw error;
  }
};

export const updateProject = async (projectId, updatedData) => {
  const response = await axios.put(`${API_URL}/${projectId}`, updatedData, getAuthHeader());
  return response.data;
};
export const deleteProject = async (projectId) => {
  try {
    const token = useStore.getState().token;
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.delete(`${API_URL}/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const assignUserToProject = async (projectId, userId) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/projects/${projectId}/assign`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error assigning user to project');
  }
};