import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import useStore from '../store/store';
import CreateRole from './CreateRole';

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useStore((state) => state.token);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/roles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data || []);
    } catch (err) {
      console.error('Error al cargar roles:', err);
      setError('Error al cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-primary-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-500">Gestión de Roles</h1>

        {/* Botón "Nuevo Rol" con solo '+' en móviles y tamaño reducido */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-light rounded-lg hover:bg-primary-600 transition-colors
            sm:px-2 sm:py-1 sm:text-lg" // Botón más pequeño en móviles
        >
          <FiPlus className="sm:w-5 sm:h-5 w-6 h-6" /> {/* Solo icono en móvil */}
        </button>
      </div>

      {/* Modal de creación de rol */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-6"> {/* Márgenes laterales */}
            <div className="p-4 relative">
              {/* Botón de Cerrar (flecha) */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 left-4 text-primary-500 hover:text-primary-700"
              >
                <FiArrowLeft className="w-6 h-6" />
              </button>
              <CreateRole onClose={() => {
                setIsModalOpen(false);
                fetchRoles();
              }} />
            </div>
          </div>
        </div>
      )}


      {/* Vista móvil con tarjetas */}
      <div className="md:hidden w-full space-y-4 px-2">
        {roles.map((role) => (
          <div key={role.role_id} className="bg-white p-4 rounded-lg shadow-md space-y-3">
            <h3 className="font-medium text-gray-900">{role.role_name}</h3>
            <p className="text-sm text-gray-500">{role.description || 'Sin descripción'}</p>
            <p className="text-sm text-gray-500">
              {new Date(role.created_at).toLocaleDateString()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {/* Editar rol */ }}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {/* Eliminar rol */ }}
                className="text-primary-500 hover:text-primary-700"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vista de escritorio (tabla) */}
      <div className="hidden md:block w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Nombre del Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Fecha de Creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.role_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {role.role_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {role.description || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(role.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {/* Editar rol */ }}
                          className="text-secondary-500 hover:text-secondary-700"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {/* Eliminar rol */ }}
                          className="text-primary-500 hover:text-primary-700"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesManagement;


