import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
        setError(''); // Limpiar errores al modificar el formulario
    };

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.first_name || !formData.last_name) {
            setError('Por favor, completa todos los campos.');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return false;
        }

        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return false;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor, introduce un email válido.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post('http://localhost:5000/api/users', {
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                status: 'active'
            });

            // Si el registro es exitoso, intentamos hacer login automáticamente
            const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            // Guardamos el token en localStorage
            localStorage.setItem('token', loginResponse.data.token);
            
            // Redirigir al usuario a la página principal
            navigate('/proyectos');
            
        } catch (err) {
            setError(
                err.response?.data?.message || 
                'Ocurrió un error durante el registro. Por favor, intenta nuevamente.'
            );
        } finally {
            setIsLoading(false);
        }
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
                        <label htmlFor="first_name" className="block text-red-500 font-medium mb-2">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="last_name" className="block text-red-500 font-medium mb-2">
                            Apellidos:
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
                            placeholder="Tus apellidos"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-red-500 font-medium mb-2">
                            Correo Electrónico:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
                            placeholder="correo@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-red-500 font-medium mb-2">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-200"
                            placeholder="Crea una contraseña"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-red-500 font-medium mb-2">
                            Confirmar Contraseña:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                        disabled={isLoading}
                        className={`w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Registrando...' : 'Registrar usuario'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;