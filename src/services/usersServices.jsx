import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:5000';

// Función para obtener los headers con el token
const getHeaders = () => {
  const token = useStore.getState().token;
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

// Obtener usuarios
export const getUsers = async () => {
  try {
    const usersResponse = await axios.get(`${API_URL}/api/users`, getHeaders());
    
    const formattedUsers = usersResponse.data.map(user => ({
      id: user.user_id,
      user_id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      created_at: user.created_at,
      status: user.status
    }));

    return formattedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Obtener roles
export const getAllUserRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user_roles`, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Error in getUserRoles service:', error);
    throw error;
  }
};

// Asignar rol
export const assignUserRole = async (userId, roleId) => {
  try {
    const response = await axios.post(`${API_URL}/api/user_roles`, {
      user_id: parseInt(userId),
      role_id: parseInt(roleId)
    }, getHeaders());
    return response.data;
  } catch (error) {
    console.error('Error asignando rol:', error);
    throw error;
  }
};

// Eliminar rol
export const removeUserRole = async (userId, roleId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/user_roles/${userId}/${roleId}`, 
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error eliminando rol:', error);
    throw error;
  }
};

// Obtener roles de un usuario específico
export const getUserRoles = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/roles/user/${userId}`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error obteniendo roles del usuario:', error);
    throw error;
  }
};