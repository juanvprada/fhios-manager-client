import { useEffect, useState } from 'react';
import { getNotifications } from '../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <button className="hover:bg-secondary-200 p-2 rounded-full text-primary-500">
        <span role="img" aria-label="notifications">🔔</span>
      </button>
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-md shadow-lg">
          <ul>
            {notifications.map((notification) => (
              <li key={notification.notification_id} className="px-4 py-2 hover:bg-gray-100">
                <div className="font-bold">{notification.title}</div>
                <div className="text-sm text-gray-600">{notification.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
