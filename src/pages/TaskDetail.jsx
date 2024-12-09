import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById } from '../services/taskServices';
import { getUsers } from '../services/usersServices';
import useStore from '../store/store';
import { FiArrowLeft, FiCalendar, FiUser, FiFlag } from 'react-icons/fi';

const TaskDetail = () => {
    const [task, setTask] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { projectId, taskId } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useStore(state => state.isAuthenticated);
    const token = useStore(state => state.token);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated || !token) {
                setError("No estás autenticado");
                setLoading(false);
                return;
            }

            try {
                const [taskData, usersData] = await Promise.all([
                    getTaskById(taskId),
                    getUsers()
                ]);
                setTask(taskData);
                setAvailableUsers(usersData);
            } catch (error) {
                console.error("Error al cargar la tarea:", error);
                setError(error.response?.data?.message || "Error al cargar los datos de la tarea");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [taskId, isAuthenticated, token]);

    if (loading) {
        return (
            <div className="p-6 md:ml-64 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 md:ml-64 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-6 pb-16">
                <div className="md:ml-64">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center mb-6 bg-gray-50 py-4">
                            <button
                                onClick={() => navigate(`/projects/${projectId}`)}
                                className="mr-4 text-gray-600 hover:text-gray-900"
                            >
                                <FiArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-2xl font-poppins font-bold text-primary-500">
                                {task.title}
                            </h1>
                        </div>

                        {/* Contenido de la tarea */}
                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                            {/* Estado y Prioridad */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="w-full sm:w-auto">
                                    <div className="text-sm text-gray-500 mb-2">Estado</div>
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium
                        ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                        {task.status}
                                    </span>
                                </div>

                                <div className="w-full sm:w-auto">
                                    <div className="text-sm text-gray-500 mb-2">Prioridad</div>
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium
                        ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'}`}>
                                        {task.priority}
                                    </span>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {task.description || "Sin descripción"}
                                    </p>
                                </div>
                            </div>

                            {/* Fechas e Información */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-4">Fechas</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-600">
                                            <FiCalendar className="w-5 h-5 mr-3 text-primary-500" />
                                            <div>
                                                <div className="text-sm text-gray-500">Fecha límite</div>
                                                <div className="font-medium">{new Date(task.due_date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Usuarios asignados */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-4">Usuarios asignados</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {task.assignedUsers?.map(userId => {
                                            const user = availableUsers.find(u => u.user_id.toString() === userId);
                                            return (
                                                <div
                                                    key={userId}
                                                    className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                                                        <FiUser className="w-4 h-4 text-primary-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {user ? user.name : "Usuario desconocido"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
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
        </div>
    );
}

export default TaskDetail;