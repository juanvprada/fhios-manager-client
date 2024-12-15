import React from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/notificactionStore';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { notifications, markAsRead } = useNotificationStore();

    const handleNotificationClick = async (notification) => {
        try {
            await markAsRead(notification.notification_id);
            onClose();

            switch (notification.type) {
                case 'project_update':
                    if (notification.reference_id) {
                        navigate(`/projects/${notification.reference_id}`);
                    }
                    break;
                case 'task_assigned':
                    if (notification.reference_id) {
                        try {
                            const response = await fetch(`http://localhost:3000/api/tasks/${notification.reference_id}`);
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const task = await response.json();

                            if (task && task.project_id) {
                                const url = `/projects/${task.project_id}/tasks/${notification.reference_id}`;
                                navigate(url);
                            } else {
                            }
                        } catch (error) {
                            console.error('7. Error al obtener o procesar la tarea:', error);
                        }
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error general en handleNotificationClick:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-50">
            <div className="py-2">
                <div className="px-4 py-2 text-lg font-semibold border-b">
                    Notificaciones
                </div>
                {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500">
                        No hay notificaciones nuevas
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.notification_id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read_status ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-gray-600">{notification.message}</div>
                            <div className="text-xs text-gray-400 mt-1">
                                {new Date(notification.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;