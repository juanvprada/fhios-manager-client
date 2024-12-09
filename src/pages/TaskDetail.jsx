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
        <div className="p-6 md:ml-64">
            {/* Header */}
            <div className="flex items-center mb-6">
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
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Estado y Prioridad */}
                <div className="flex gap-4 mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                        {task.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'}`}>
                        {task.priority}
                    </span>
                </div>

                {/* Descripción */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
                    <p className="text-gray-600">{task.description || "Sin descripción"}</p>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                        <FiCalendar className="w-5 h-5 mr-2" />
                        <span>Fecha límite: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Usuarios asignados */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Usuarios asignados</h2>
                    <div className="flex flex-wrap gap-2">
                        {task.assignedUsers?.map(userId => {
                            const user = availableUsers.find(u => u.user_id.toString() === userId);
                            return (
                                <div
                                    key={userId}
                                    className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                                >
                                    <FiUser className="w-4 h-4 mr-2" />
                                    <span className="text-sm">
                                        {user ? `${user.name}` : "Usuario desconocido"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;