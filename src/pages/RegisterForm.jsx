import React, { useState } from 'react';


const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!username || !email || !password || !confirmPassword) {
            setError('Por favor, completa todos los campos.');
            return;
          }
      
          if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
          }
      
          if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
          }

          console.log('Registration data:', { username, email, password });
          setError('Registro exitoso. Redirigiendo...');
        };
     
    return (
    <div 
      className="flex justify-center items-center h-screen bg-cover bg-center" 
      style={{ backgroundImage: 'url("../src/assets/Onda inicio.png")' }}>
        
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Registro de Usuario
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-red-500 font-medium mb-2"
            >
              Nombre de Usuario:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
              placeholder="Nombre de usuario"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="email" 
              className="block text-red-500 font-medium mb-2"
            >
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
              placeholder="Correo electrónico"
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
              placeholder="Crea una contraseña"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="confirm-password" 
              className="block text-red-500 font-medium mb-2"
            >
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
              placeholder="Repite la contraseña"
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
            Registrar usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;