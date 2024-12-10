import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const AccessDenied = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen p-6">
      <FiAlertTriangle className="w-16 h-16 text-primary-500 mb-4" />
      <h1 className="text-3xl font-bold text-primary-500 mb-2">Acceso Denegado</h1>
      <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
      <Link 
        to="/"
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default AccessDenied;