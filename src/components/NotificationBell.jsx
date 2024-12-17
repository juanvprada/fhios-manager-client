import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import useNotificationStore from '../store/notificactionStore';
import useStore from '../store/store';
import socket from '../services/socketServices';

const NotificationBell = ({ onClick }) => {
    const { unreadCount, fetchUnreadNotifications, addNotification } = useNotificationStore();
    const user = useStore(state => state.user);

    useEffect(() => {
        if (user?.id) {
            fetchUnreadNotifications(user.id);

            socket.on(`notification:${user.id}`, (notification) => {
                addNotification(notification);
            });
        }

        return () => {
            if (user?.id) {
                socket.off(`notification:${user.id}`);
            }
        };
    }, [user]);

    return (
        <button
            onClick={onClick}
            className="relative p-2 hover:bg-secondary-200 rounded-full"
        >
            <Bell className="w-5 h-5 text-secondary-600" />
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

export default NotificationBell;