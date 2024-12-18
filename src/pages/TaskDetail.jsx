import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, updateTask, deleteTask } from '../services/taskServices';
import { getUsers } from '../services/usersServices';
import { uploadDocument, getTaskDocuments } from '../services/documentServices';
import useStore from '../store/store';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import DocumentList from '../components/DocumentList';
import { deleteDocument } from '../services/documentServices';
import {
    FiArrowLeft,
    FiCalendar,
    FiUser,
    FiEdit2,
    FiTrash2,
    FiClock,
    FiPlus
} from 'react-icons/fi';

const TaskDetail = () => {
    const [task, setTask] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
    const [documentError, setDocumentError] = useState({ show: false, message: '' });
    const [documentDescriptions, setDocumentDescriptions] = useState({});

    const { projectId, taskId } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useStore(state => state.isAuthenticated);
    const token = useStore(state => state.token);
    const userRole = useStore(state => state.role);

    const canModifyTask = () => {
        return ['admin', 'Project Manager'].includes(userRole);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated || !token) {
                setError("No estás autenticado");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [taskData, usersData] = await Promise.all([
                    getTaskById(taskId),
                    getUsers()
                ]);

                const documentList = await getTaskDocuments(taskId);
                setDocuments(Array.isArray(documentList) ? documentList : []);

                setTask(taskData);
                setEditedTask({
                    ...taskData,
                    assignedUsers: taskData.assignedUsers || [],
                    estimated_hours: taskData.estimated_hours || 0,
                    status: taskData.status || 'pending',
                    priority: taskData.priority || 'low',
                    due_date: taskData.due_date || ''
                });
                const userMap = {};
                usersData.forEach(user => {
                    userMap[user.user_id] = user.name;
                });
                setAvailableUsers(userMap);

                setAvailableUsers(usersData);
                setError(null);

                const savedDescriptions = JSON.parse(localStorage.getItem('documentDescriptions') || '{}');
                setDocumentDescriptions(savedDescriptions);
            } catch (error) {
                console.error("Error al cargar la tarea:", error);
                setError(error.response?.data?.message || "Error al cargar los datos de la tarea");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [taskId, isAuthenticated, token]);

    useEffect(() => {
        localStorage.setItem('documentDescriptions', JSON.stringify(documentDescriptions));
    }, [documentDescriptions]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const onConfirmDelete = async () => {
        try {
            setLoading(true);
            await deleteTask(taskId);
            navigate(`/projects/${projectId}`);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            setError('No se pudo eliminar la tarea. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const updatedTask = await updateTask(taskId, editedTask);
            setTask(updatedTask);
            setIsEditing(false);
            setError(null);
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            setError('No se pudo actualizar la tarea. Por favor, intenta de nuevo.');
        }
    };

    const handleDocumentUpload = async (formData) => {
        try {
            setLoading(true);

            const newDocument = await uploadDocument(taskId, formData);

            // Guardar la descripción localmente
            setDocumentDescriptions((prev) => ({
                ...prev,
                [newDocument.document_id]: formData.get('description'),
            }));

            setDocuments((prev) => [...prev, newDocument]);
            setShowDocumentUploadModal(false);
        } catch (error) {
            console.error('Error al subir el documento:', error);
            setDocumentError({
                show: true,
                message: 'Error al subir el documento. Por favor, inténtelo de nuevo.',
            });
        } finally {
            setLoading(false);
        }
    };


    const renderDocumentsSection = () => (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
                <button
                    onClick={() => setShowDocumentUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    Subir Documento
                </button>
            </div>

            <DocumentList
                documents={documents}
                descriptions={documentDescriptions}
                task={task}
                onDeleteDocument={handleDeleteDocument}
            />

            {showDocumentUploadModal && (
                <DocumentUploadModal
                    taskId={taskId}
                    onSubmit={handleDocumentUpload}
                    onClose={() => setShowDocumentUploadModal(false)}
                />
            )}
        </div>
    );
    const handleDeleteDocument = async (documentId) => {
        try {
            await deleteDocument(documentId);
            setDocuments(prevDocs => prevDocs.filter(doc => doc.document_id !== documentId));
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            setError('Error al eliminar el documento. Por favor, intenta de nuevo.');
            throw error;
        }
    };

    const renderAssignedUsers = () => (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Usuarios asignados</h3>
            {isEditing ? (
                <div className="border border-gray-300 rounded-lg w-full p-3 max-h-[300px] overflow-y-auto">
                    {availableUsers.map((user) => (
                        <div key={user.user_id} className="flex items-center p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                id={`user-${user.user_id}`}
                                value={user.user_id.toString()}
                                checked={editedTask.assignedUsers.includes(user.user_id.toString())}
                                onChange={(e) => {
                                    const userId = e.target.value;
                                    setEditedTask(prev => ({
                                        ...prev,
                                        assignedUsers: e.target.checked
                                            ? [...prev.assignedUsers, userId]
                                            : prev.assignedUsers.filter(id => id !== userId)
                                    }));
                                }}
                                className="mr-3"
                            />
                            <label htmlFor={`user-${user.user_id}`}>{user.name}</label>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {task.assignedUsers?.map((userId) => {
                        const user = availableUsers.find((u) => u.user_id.toString() === userId);
                        return (
                            <div key={userId} className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                <FiUser className="w-4 h-4 text-primary-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">
                                    {user ? user.name : 'Usuario desconocido'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 pt-6 pb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="sticky top-0 z-10 bg-gray-50 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={() => navigate(`/projects/${projectId}`)}
                                    className="mr-4 text-gray-600 hover:text-gray-900"
                                >
                                    <FiArrowLeft className="w-6 h-6" />
                                </button>
                                {!isEditing ? (
                                    <h1 className="text-xl sm:text-2xl font-bold text-primary-500">{task.title}</h1>
                                ) : (
                                    <input
                                        type="text"
                                        value={editedTask.title}
                                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                        className="text-xl sm:text-2xl font-bold bg-transparent border-b border-primary-500 focus:outline-none"
                                    />
                                )}
                            </div>

                            {/* Botones de edición/eliminación */}
                            {canModifyTask() && !isEditing && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleEditClick}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar tarea"
                                    >
                                        <FiEdit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar tarea"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {isEditing && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="w-full sm:w-auto">
                                <div className="text-sm text-gray-500 mb-2">Estado</div>
                                {isEditing ? (
                                    <select
                                        value={editedTask.status}
                                        onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                                        className="px-4 py-2 rounded-lg text-sm font-medium border"
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="in_progress">En Progreso</option>
                                        <option value="blocked">Bloqueada</option>
                                        <option value="completed">Completada</option>
                                    </select>
                                ) : (
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-800' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : task.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{task.status}</span>
                                )}
                            </div>
                            <div className="w-full sm:w-auto">
                                <div className="text-sm text-gray-500 mb-2">Prioridad</div>
                                {isEditing ? (
                                    <select
                                        value={editedTask.priority}
                                        onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                                        className="px-4 py-2 rounded-lg text-sm font-medium border"
                                    >
                                        <option value="low">Baja</option>
                                        <option value="medium">Media</option>
                                        <option value="high">Alta</option>
                                    </select>
                                ) : (
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{task.priority}</span>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
                            <div className="bg-gray-50 rounded-lg p-6">
                                {isEditing ? (
                                    <textarea
                                        value={editedTask.description}
                                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                        className="w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                ) : (
                                    <p className="text-gray-600 whitespace-pre-line">{task.description || 'Sin descripción'}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Información</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="w-5 h-5 mr-3 text-primary-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Fecha límite</div>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={editedTask.due_date}
                                                    onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                                                    className="border rounded-lg p-1"
                                                />
                                            ) : (
                                                <div className="font-medium">{new Date(task.due_date).toLocaleDateString()}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiClock className="w-5 h-5 mr-3 text-primary-500" />
                                        <div>
                                            <div className="text-sm text-gray-500">Horas estimadas</div>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editedTask.estimated_hours}
                                                    onChange={(e) => setEditedTask({ ...editedTask, estimated_hours: parseInt(e.target.value) })}
                                                    className="border rounded-lg p-1"
                                                />
                                            ) : (
                                                <div className="font-medium">{task.estimated_hours} horas</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {renderAssignedUsers()}
                        </div>

                        {renderDocumentsSection()}

                        <DeleteConfirmationModal
                            isOpen={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={onConfirmDelete}
                            title="Eliminar Tarea"
                            message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
                        />
                        {showDocumentUploadModal && (
                            <DocumentUploadModal
                                taskId={taskId}
                                onSubmit={handleDocumentUpload}
                                onClose={() => setShowDocumentUploadModal(false)}
                            />
                        )}

                        <div className="flex flex-wrap gap-4 justify-end border-t pt-6">
                            <button
                                onClick={() => navigate(`/projects/${projectId}`)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Volver al proyecto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;