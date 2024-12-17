import React, { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const tempPassword = Math.random().toString(36).slice(-8);
           // Primero enviamos el email
      const emailResponse = await emailjs.send(
            'service_',
            'template_',
      {
        to_email: email,
        temp_password: tempPassword
      },
        
            ''
          );
      
          if (emailResponse.status === 200) {
            try {
              const backendResponse = await axios.post('http://localhost:3000/api/auth/reset-password', {
                email,
                tempPassword
              });
    
              if (backendResponse.status === 200) {
                setStatus({
                  message: 'Se ha enviado un correo con tu nueva contraseña temporal',
                  type: 'success'
                });
              }
            } catch (backendError) {
              console.error('Error al actualizar contraseña:', backendError);
              setStatus({
                message: backendError.response?.data?.error || 'Error al actualizar la contraseña',
                type: 'error'
              });
            }
          }
        } catch (error) {
          console.error('Error al enviar email:', error);
          setStatus({
            message: 'Error al enviar el correo. Por favor, inténtalo de nuevo.',
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      };
    
      return (
        <div 
          className="flex justify-center items-center min-h-screen bg-[length:100%_50%] bg-no-repeat bg-top"
          style={{ backgroundImage: 'url("../src/assets/Onda_inicio.webp")' }}
        >
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Recuperar Contraseña
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
    
              {status.message && (
                <div className={`p-3 rounded text-center ${
                  status.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {status.message}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
              
              <Link 
                to="/login" 
                className="block text-center text-blue-500 mt-4 hover:text-blue-600 hover:underline"
              >
                Volver al inicio de sesión
              </Link>
            </form>
          </div>
        </div>
      );
    };
    
    export default ForgotPassword;