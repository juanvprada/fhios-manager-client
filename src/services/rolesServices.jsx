import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:3000';

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

export const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/api/roles/${roleId}`, roleData, getHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRole = async (roleId) => {
  try {
    await axios.delete(`${API_URL}/api/roles/${roleId}`, getHeaders());
    return true;
  } catch (error) {
    throw error;
  }
};

export const getRoleById = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/api/roles/${roleId}`, getHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};