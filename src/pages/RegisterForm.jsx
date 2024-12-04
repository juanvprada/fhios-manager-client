import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store.js';
import axios from 'axios';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    // Gestión de estado global
    const setToken = useStore((state) => state.setToken);
    const setRole = useStore((state) => state.setRole);
    const setUserName = useStore((state) => state.setUsername);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
          setError('Por favor, completa todos los campos.');
          return;
        }
    
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', { 
            username, 
            password 
          });
    
          const { token, role, name } = response.data;
    
          if (token) {
            // Almacenar datos en estado global
            setToken(token);
            setRole(role);
            setUserName(name);
    
            // Redirigir según el rol
            navigate(role === 'admin' ? '/admin-dashboard' : '/dashboard');
          } else {
            setError('Nombre de usuario o contraseña incorrectos.');
          }
        } catch (error) {
          console.error('Error de autenticación:', error);
          setError('No se recibió respuesta del servidor.');
        }
      };
};

export default RegisterForm;