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
    // Enhanced error handling with specific messages
    if (axios.isAxiosError(error)) {
      console.error('API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error creating role');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};