// DocumentList.jsx
import React, { useState, useEffect } from 'react';
import { Download, FileText, Clock, Trash2 } from 'lucide-react';
import { downloadDocument } from '../services/documentServices';
import { getUsers } from '../services/usersServices';
import useStore from '../store/store';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import PropTypes from 'prop-types';  // Import PropTypes

const DocumentList = ({ documents, descriptions, task, onDeleteDocument }) => {
  const [users, setUsers] = useState({});
  const userRole = useStore(state => state.role);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const canModifyTask = () => {
    return ['admin', 'Project Manager', 'Tech Leader'].includes(userRole);
  };

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

  const extractHours = (docId) => {
    const description = descriptions[docId];
    if (!description) return 0;
    const match = description.match(/<!--HOURS:([\d.]+)-->/);
    return match ? parseFloat(match[1]) : 0;
  };

  const cleanDescription = (docId) => {
    const description = descriptions[docId];
    if (!description) return '';
    return description.replace(/<!--HOURS:[\d.]+-->/g, '').trim();
  };

  const totalHoursSpent = documents.reduce((acc, doc) => {
    return acc + extractHours(doc.document_id);
  }, 0);

  const remainingHours = task?.estimated_hours ? 
    Math.max(0, task.estimated_hours - totalHoursSpent) : 0;

  if (!documents.length) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay documentos adjuntos</p>
      </div>
    );
  }

  const handleDeleteClick = (documentId) => {
    setDocumentToDelete(documentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDeleteDocument(documentToDelete);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Error al eliminar documento:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Component JSX remains the same */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Documento"
        message="¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer."
      />
    </div>
  );
};

// Add PropTypes validation
DocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      document_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      uploaded_by: PropTypes.string.isRequired
    })
  ).isRequired,
  descriptions: PropTypes.objectOf(PropTypes.string).isRequired,
  task: PropTypes.shape({
    estimated_hours: PropTypes.number
  }).isRequired,
  onDeleteDocument: PropTypes.func.isRequired
};

export default DocumentList;
