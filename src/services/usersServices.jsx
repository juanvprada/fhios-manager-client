import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const { token } = useStore.getState();
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getUsers = async () => {
  try {
    const usersResponse = await axios.get(`${API_URL}/users`, getAuthHeader());
    
    // Formatear los datos directamente
    const formattedUsers = usersResponse.data.map(user => ({
      id: user.user_id,
      user_id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: 'admin',
      created_at: user.created_at,
      status: user.status
    }));

    console.log('Formatted Users:', formattedUsers);
    return formattedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Obtener todos los roles de usuarios
export const getAllUserRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/user_roles`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error in getUserRoles service:', error);
    throw error;
  }
};

// Otras funciones se mantienen igual...

export const updateUserRole = async (userId, roleId) => {
  try {
    const response = await axios.post(`${API_URL}/user_roles`, {
      user_id: userId,
      role_id: roleId
    }, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error in updateUserRole service:', error);
    throw error;
  }
};