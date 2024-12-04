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
     
};

export default RegisterForm;