// src/__tests__/components/Navbar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock de los componentes de notificaciones
jest.mock('../../components/NotificationBell', () => {
  return function MockBell() {
    return <div data-testid="notification-bell">Bell</div>;
  }
});

jest.mock('../../components/NotificationsDropdown', () => {
  return function MockDropdown() {
    return <div data-testid="notifications-dropdown">Dropdown</div>;
  }
});

// Mock de useStore
const mockUser = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com'
};

const mockLogout = jest.fn();

jest.mock('../../store/store', () => {
  const store = () => ({
    user: mockUser,
    logout: mockLogout,
    isAuthenticated: true,
  });
  store.getState = store;
  return {
    __esModule: true,
    default: (selector) => selector(store())
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar isOpen={false} setIsOpen={jest.fn()} />
      </BrowserRouter>
    );
  };

  test('renders correctly', () => {
    renderNavbar();
    expect(screen.getByText('Fhios Manager')).toBeInTheDocument();
    expect(screen.getByText('FM')).toBeInTheDocument();
  });

  test('displays user name and initials', () => {
    renderNavbar();
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('toggles profile dropdown when clicking profile button', () => {
    renderNavbar();
    const profileButton = screen.getByText('John Doe').closest('button');
    fireEvent.click(profileButton);
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  test('shows notification bell for authenticated users', () => {
    renderNavbar();
    expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
  });

  test('shows email in profile dropdown', () => {
    renderNavbar();
    const profileButton = screen.getByText('John Doe').closest('button');
    fireEvent.click(profileButton);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});