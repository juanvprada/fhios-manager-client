import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import NotificationDropdown from '../../components/NotificationsDropdown';
import useNotificationStore from '../../store/notificactionStore';

// Mock de useNotificationStore
jest.mock('../../store/notificactionStore', () => {
  return jest.fn(() => ({
    notifications: [
      {
        notification_id: 1,
        title: 'Notification 1',
        message: 'This is the first notification',
        read_status: false,
        created_at: '2024-12-14T12:00:00Z',
      },
      {
        notification_id: 2,
        title: 'Notification 2',
        message: 'This is the second notification',
        read_status: true,
        created_at: '2024-12-13T10:00:00Z',
      },
    ],
  }));
});

describe('NotificationDropdown', () => {
  const mockOnClose = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <NotificationDropdown isOpen={true} onClose={mockOnClose} {...props} />
      </BrowserRouter>
    );
  };

  test('renders correctly when open', () => {
    renderComponent();

    // Verificar que el título del dropdown está presente
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();

    // Verificar que las notificaciones se muestran correctamente
    expect(screen.getByText(/Notification 1/)).toBeInTheDocument();
    expect(screen.getByText(/Notification 2/)).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <BrowserRouter>
        <NotificationDropdown isOpen={false} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // Verificar que el dropdown no se renderiza
    expect(screen.queryByText('Notificaciones')).not.toBeInTheDocument();
  });
});

