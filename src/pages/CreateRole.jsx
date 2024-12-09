// pages/CreateRole.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { createRole } from '../services/rolesServices';

const CreateRole = () => {
  const [formData, setFormData] = useState({
    role_name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createRole(formData);
      navigate('/roles');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" font-poppins content-center flex flex-col justify-center items-center w-full">
      <div className="flex w-full items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-500 hover:text-primary-600"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-primary-500">Crear Nuevo Rol</h1>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="w-full bg-white p-6 rounded-lg "
      >
        <div className="mb-6">
          <label 
            htmlFor="role_name"
            className="block text-gray-700 font-medium mb-2"
          >
            Nombre del Rol *
          </label>
          <input
            type="text"
            id="role_name"
            name="role_name"
            value={formData.role_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ej: Administrador"
          />
        </div>

        <div className="mb-6">
          <label 
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Describe las responsabilidades y permisos de este rol"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Rol'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;