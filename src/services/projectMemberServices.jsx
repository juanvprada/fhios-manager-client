import axios from 'axios';

const API_URL = '/api/project-members';

export const assignUserToProject = async (projectId, userId, role = 'member') => {
  const response = await axios.post(API_URL, {
    project_id: projectId,
    user_id: userId,
    role
  });
  return response.data;
};

export const removeUserFromProject = async (projectId, userId) => {
  await axios.delete(`${API_URL}/${projectId}/${userId}`);
};

export const getProjectMembers = async (projectId) => {
  const response = await axios.get(`${API_URL}/${projectId}`);
  return response.data;
};