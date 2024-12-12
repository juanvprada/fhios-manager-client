import axios from 'axios';
import useStore from '../store/store';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = useStore.getState().token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const uploadDocument = async (taskId, formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/documents`,
      formData,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error en uploadDocument:', error);
    throw new Error(error.response?.data?.message || 'Error al subir el documento');
  }
};

export const getTaskDocuments = async (taskId) => {
  try {
    const response = await axios.get(
      `${API_URL}/tasks/${taskId}/documents`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error en getTaskDocuments:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener los documentos');
  }
};

export const downloadDocument = async (documentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/documents/${documentId}`,
      getAuthHeader()
    );

    const { signedUrl } = response.data;
    if (!signedUrl) {
      throw new Error('No se pudo obtener la URL de descarga');
    }

    // Abrir la URL de descarga en una nueva ventana o pestaña
    window.open(signedUrl, '_blank');
  } catch (error) {
    console.error('Error en downloadDocument:', error);
    throw new Error(error.response?.data?.message || 'Error al descargar el documento');
  }
};
