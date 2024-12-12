import { create } from 'zustand';
import axios from 'axios';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  setNotifications: (notifications) => {
    set({ 
      notifications,
      unreadCount: notifications.filter(n => !n.read_status).length
    });
  },

  fetchUnreadNotifications: async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/notifications/user/${userId}/unread`);
      set({ 
        notifications: response.data,
        unreadCount: response.data.length
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${notificationId}`, { read_status: true });
      const notifications = get().notifications.map(notif =>
        notif.notification_id === notificationId 
          ? { ...notif, read_status: true }
          : notif
      );
      set({ 
        notifications,
        unreadCount: notifications.filter(n => !n.read_status).length
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  addNotification: (notification) => {
    set(state => ({ 
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },
}));

export default useNotificationStore;