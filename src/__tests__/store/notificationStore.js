import { act } from '@testing-library/react';
import axios from 'axios';
import useNotificationStore from '../../store/notificactionStore';

jest.mock('axios');

describe('notificationStore', () => {
  afterEach(() => {
    // Restablecer el estado después de cada prueba
    useNotificationStore.setState({
      notifications: [],
      unreadCount: 0,
    });
    jest.clearAllMocks();
  });

  test('debería tener un estado inicial correcto', () => {
    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([]);
    expect(state.unreadCount).toBe(0);
  });

  test('setNotifications debería actualizar las notificaciones y el contador de no leídas', () => {
    const notificationsMock = [
      { notification_id: 1, read_status: false },
      { notification_id: 2, read_status: true },
    ];

    act(() => {
      useNotificationStore.getState().setNotifications(notificationsMock);
    });

    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual(notificationsMock);
    expect(state.unreadCount).toBe(1);
  });

  test('fetchUnreadNotifications debería obtener notificaciones no leídas y actualizar el estado', async () => {
    const userId = 1;
    const notificationsMock = [
      { notification_id: 1, read_status: false },
      { notification_id: 2, read_status: false },
    ];
    axios.get.mockResolvedValue({ data: notificationsMock });

    await act(async () => {
      await useNotificationStore.getState().fetchUnreadNotifications(userId);
    });

    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual(notificationsMock);
    expect(state.unreadCount).toBe(2);
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:3000/api/notifications/user/${userId}/unread`);
  });

  test('markAsRead debería marcar la notificación como leída y actualizar el contador', async () => {
    const notificationsMock = [
      { notification_id: 1, read_status: false },
      { notification_id: 2, read_status: false },
    ];
    useNotificationStore.setState({ notifications: notificationsMock, unreadCount: 2 });

    axios.put.mockResolvedValue({});

    await act(async () => {
      await useNotificationStore.getState().markAsRead(1);
    });

    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([
      { notification_id: 1, read_status: true },
      { notification_id: 2, read_status: false },
    ]);
    expect(state.unreadCount).toBe(1);
    expect(axios.put).toHaveBeenCalledWith(`http://localhost:3000/api/notifications/1`, { read_status: true });
  });

  test('addNotification debería añadir una nueva notificación y actualizar el contador de no leídas', () => {
    const newNotification = { notification_id: 3, read_status: false };
    act(() => {
      useNotificationStore.getState().addNotification(newNotification);
    });

    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([newNotification]);
    expect(state.unreadCount).toBe(1);
  });
});
