import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationBell from '../../components/NotificationBell';
import socket from '../../services/socketServices';
import useNotificationStore from '../../store/notificactionStore';
import useStore from '../../store/store';

// Mocks de stores
jest.mock('../../store/notificactionStore', () => {
  const fetchUnreadNotifications = jest.fn();
  const addNotification = jest.fn();
  return jest.fn(() => ({
    unreadCount: 5,
    fetchUnreadNotifications,
    addNotification,
  }));
});

jest.mock('../../store/store', () => {
  const user = { id: 1, name: 'Test User' };
  return jest.fn(() => ({
    user,
  }));
});

// Mock de socket
jest.mock('../../services/socketServices', () => ({
  on: jest.fn(),
  off: jest.fn(),
}));

describe('NotificationBell', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with unread notifications', () => {
    render(<NotificationBell onClick={mockOnClick} />);

    // Verificar que el botón está presente
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Verificar que el contador de notificaciones no leídas se muestra
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('calls onClick when the bell is clicked', () => {
    render(<NotificationBell onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verificar que se llamó a la función `onClick`
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('does not render unread count when unreadCount is 0', () => {
    useNotificationStore.mockReturnValue({
      unreadCount: 0,
      fetchUnreadNotifications: jest.fn(),
      addNotification: jest.fn(),
    });

    render(<NotificationBell onClick={mockOnClick} />);

    // Verificar que no se muestra el contador de notificaciones no leídas
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
