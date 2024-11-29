import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store.js';
import axios from 'axios';

const LoginForm = () => {
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

  return (
    <div 
      className="flex justify-center items-center h-screen bg-cover bg-center" 
      style={{ backgroundImage: 'url("../src/assets/Onda inicio.png")' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Bienvenido
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-red-500 font-medium mb-2"
            >
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
              placeholder="Introduce tu nombre de usuario"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-red-500 font-medium mb-2"
            >
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
              placeholder="Introduce tu contraseña"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-center mt-2">
              {error}
            </p>
          )}
          
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            Iniciar sesión
          </button>
          
          <a 
            href="/forgot-password" 
            className="block text-center text-blue-500 mt-4 hover:text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;