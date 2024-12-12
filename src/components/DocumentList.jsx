import React from 'react';
import { Download, FileText } from 'lucide-react';
import { downloadDocument } from '../services/documentServices';

const DocumentList = ({ documents, descriptions, users }) => {
  const handleDownload = async (documentId) => {
    try {
      await downloadDocument(documentId);
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  };

  if (!documents.length) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay documentos adjuntos</p>
      </div>
    );
  }

  return (
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
              {descriptions[doc.document_id] || (
                <span className="italic text-gray-400">Sin descripción</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Subido por: {users[doc.uploaded_by]?.name || 'Desconocido'}
            </p>
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
  );
};

export default DocumentList;


