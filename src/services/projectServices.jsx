import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:5000/api/projects';

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
  const response = await axios.post(API_URL, projectData, getAuthHeader());
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}`, getAuthHeader());
  return response.data;
};

export const updateProject = async (projectId, updatedData) => {
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
