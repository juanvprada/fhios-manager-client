import React, { useState } from 'react';
import { Upload, X, Clock } from 'lucide-react';
import PropTypes from 'prop-types'; // Add this import

const DocumentUploadModal = ({ taskId, onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [hoursSpent, setHoursSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
        setError('El archivo no debe superar los 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim() || !description.trim()) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('file', file);
      // Añadimos las horas al final de la descripción
      const descriptionWithHours = `${description.trim()}\n<!--HOURS:${hoursSpent}-->`;
      formData.append('description', descriptionWithHours);

      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError('Error al subir el documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Subir Documento
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del documento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Breve descripción del documento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas dedicadas *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={hoursSpent}
                  onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Seleccionar archivo</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG o PNG hasta 5MB
                  </p>
                  {file && (
                    <p className="text-sm text-gray-600">{file.name}</p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subiendo...
                  </span>
                ) : 'Subir'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

DocumentUploadModal.propTypes = {
  taskId: PropTypes.string.isRequired,  // Add validation for taskId
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DocumentUploadModal;
