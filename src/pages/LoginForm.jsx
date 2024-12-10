import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store.js';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Obtenemos la función login del store
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Primer paso: Login
      const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
  
      if (loginResponse.data.token) {
        const token = loginResponse.data.token;
        
        try {
          // Configurar headers para las siguientes peticiones
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
  
          // Segundo paso: Obtener perfil
          const profileResponse = await axios.get(
            "http://localhost:5000/api/auth/profile",
            config
          );
          
          console.log("Profile Response:", profileResponse.data);
  
          // Tercer paso: Obtener roles DESPUÉS de tener el perfil
          const userRolesResponse = await axios.get(
            `http://localhost:5000/api/roles/user/${profileResponse.data.data.id}`,
            config
          );
  
          const userData = profileResponse.data.data;
          const userRoles = userRolesResponse.data.data || [];
  
          // Almacenar en el store
          login({
            user: userData,
            token,
            roles: userRoles.length > 0 ? userRoles : [{ role_name: 'USER' }]
          });
  
          navigate("/dashboard");
        } catch (profileError) {
          console.error("Error al obtener perfil:", profileError);
          setError("Error al obtener información del usuario");
        }
      } else {
        setError("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error de login:", error);
      setError("Credenciales inválidas");
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
              htmlFor="email" 
              className="block text-red-500 font-medium mb-2"
            >
              Correo electrónico:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
              placeholder="Introduce tu correo electrónico"
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