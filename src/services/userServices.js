// services.js
import axios from 'axios';

// Configuración base de axios
const API_URL = 'https://tu-api-backend.com'; // Reemplaza con tu URL de API real

// Función para obtener el token de autenticación desde el almacenamiento local
const getToken = () => {
  return localStorage.getItem('token');
};

// Servicio de usuario con métodos para gestionar operaciones relacionadas
export const userService = {
  // Método para cambiar la contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/change-password`, 
        { 
          currentPassword, 
          newPassword 
        },
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        // El servidor respondió con un estado de error
        throw new Error(error.response.data.message || 'Error al cambiar la contraseña');
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        throw new Error('No se pudo conectar con el servidor');
      } else {
        // Algo sucedió al configurar la solicitud
        throw new Error('Error en la solicitud de cambio de contraseña');
      }
    }
  },

  // Método para cerrar sesión
  logout() {
    try {
      // Llamada a la API para invalidar el token (opcional, depende de tu backend)
      axios.post(`${API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      // Limpiar el token y cualquier otra información de sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Aquí podrías hacer otras tareas de limpieza de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
};