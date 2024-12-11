import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Cambia a la URL de tu backend
    socket.on('notification', (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="relative">
      <button className="relative">
        <span>🔔</span>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
          {notifications.length}
        </span>
      </button>
      <div className="absolute bg-white shadow-lg p-2">
        {notifications.map((notif, index) => (
          <div key={index} className="p-2 border-b">
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
