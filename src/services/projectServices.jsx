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
    console.log('Datos enviados al crear proyecto:', projectData);

    const dataToSend = {
      ...projectData,
      selectedUsers: projectData.selectedUsers,
    };

    console.log('Datos formateados para enviar:', dataToSend);
    const response = await axios.post(API_URL, dataToSend, getAuthHeader());
    console.log('Respuesta del backend al crear:', response.data);
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
    console.log('Obteniendo proyecto con ID:', projectId);
    const response = await axios.get(`${API_URL}/${projectId}`, getAuthHeader());
    console.log('Datos crudos del proyecto recibido:', response.data);

    // Asegurarnos de que assignedUsers exista
    const projectData = {
      ...response.data,
      assignedUsers: response.data.selectedUsers || response.data.assignedUsers || []
    };

    console.log('Datos del proyecto procesados:', projectData);
    return projectData;
  } catch (error) {
    console.error('Error en getProjectById:', error);
    throw error;
  }
};

export const updateProject = async (projectId, updatedData) => {
  console.log('Datos enviados al actualizar proyecto:', updatedData);
  const response = await axios.put(`${API_URL}/${projectId}`, updatedData, getAuthHeader());
  return response.data;
};
export const deleteProject = async (projectId) => {
  await axios.delete(`${API_URL}/${projectId}`, getAuthHeader());
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