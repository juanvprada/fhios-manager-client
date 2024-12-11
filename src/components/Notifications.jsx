import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000'); // URL del backend
    socket.on('notification', (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-4 text-sm text-gray-700 font-bold border-b">Notificaciones</div>
          <ul className="max-h-60 overflow-auto">
            {notifications.map((notif, index) => (
              <li key={index} className="p-3 border-b text-gray-600 hover:bg-gray-100">
                {notif.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;