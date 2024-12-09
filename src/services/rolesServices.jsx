import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:5000';

const getHeaders = () => {
  const token = useStore.getState().token;
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

export const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/api/roles`, roleData, getHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};