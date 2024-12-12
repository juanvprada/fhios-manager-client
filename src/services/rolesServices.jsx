// services/rolesServices.js
import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:3000/api';

export const createRole = async (roleData) => {
  const token = useStore.getState().token;
  
  try {
    const response = await axios.post(`${API_URL}/roles`, roleData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en createRole:', error.response?.data || error);
    throw error;
  }
};

export const getRoles = async () => {
  const token = useStore.getState().token;
  
  try {
    const response = await axios.get(`${API_URL}/roles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en getRoles:', error.response?.data || error);
    throw error;
  }
};