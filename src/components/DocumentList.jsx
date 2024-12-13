// DocumentList.jsx
import React, { useState, useEffect } from 'react';
import { Download, FileText, Clock } from 'lucide-react';
import { downloadDocument } from '../services/documentServices';
import { getUsers } from '../services/usersServices';

const DocumentList = ({ documents, descriptions, task }) => {
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        const userMap = userList.reduce((acc, user) => ({
          ...acc,
          [user.user_id]: user.name
        }), {});
        setUsers(userMap);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDownload = async (documentId) => {
    try {
      await downloadDocument(documentId);
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  };

  // Función para extraer las horas de la descripción
  const extractHours = (docId) => {
    const description = descriptions[docId];
    if (!description) return 0;
    const match = description.match(/<!--HOURS:([\d.]+)-->/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Función para limpiar la descripción
  const cleanDescription = (docId) => {
    const description = descriptions[docId];
    if (!description) return '';
    return description.replace(/<!--HOURS:[\d.]+-->/g, '').trim();
  };

  // Calcular total de horas usadas
  const totalHoursSpent = documents.reduce((acc, doc) => {
    return acc + extractHours(doc.document_id);
  }, 0);

  // Calcular horas restantes
  const remainingHours = task?.estimated_hours ?
    Math.max(0, task.estimated_hours - totalHoursSpent) : 0;

  if (!documents.length) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay documentos adjuntos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen de horas */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Horas Estimadas:</span>
            <span className="ml-2 font-medium">{task?.estimated_hours || 0}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Horas Registradas:</span>
            <span className="ml-2 font-medium">{totalHoursSpent}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Horas Restantes:</span>
            <span className={`ml-2 font-medium ${remainingHours === 0 ? 'text-red-600' : ''}`}>
              {remainingHours}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.document_id}
            className="flex items-start justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{doc.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                {cleanDescription(doc.document_id) || (
                  <span className="italic text-gray-400">Sin descripción</span>
                )}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-xs text-gray-500">
                  Subido por: {users[doc.uploaded_by] || 'Usuario desconocido'}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  {extractHours(doc.document_id)} horas
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(doc.document_id)}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title="Descargar documento"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;


