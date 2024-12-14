import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../../pages/Profile';
import useProfile from '../../hooks/useProfile';
import useStore from '../../store/store';

// Mock useProfile
jest.mock('../../hooks/useProfile', () => jest.fn());

// Mock useStore
jest.mock('../../store/store', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Profile', () => {
  const mockProfileState = {
    currentPassword: '',
    setCurrentPassword: jest.fn(),
    newPassword: '',
    setNewPassword: jest.fn(),
    confirmPassword: '',
    setConfirmPassword: jest.fn(),
    error: '',
    success: false,
    loading: false,
    handlePasswordUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.mockReturnValue({ user: { name: 'John Doe', email: 'john@example.com', role: 'admin' } });
    useProfile.mockReturnValue(mockProfileState);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

  test('renders ChangePasswordForm component', () => {
    renderComponent();

    expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument(); // Assuming a header or button text inside ChangePasswordForm
    expect(screen.getByLabelText('Contraseña Actual')).toBeInTheDocument();
    expect(screen.getByLabelText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toBeInTheDocument();
  });

  test('shows error message on password update failure', () => {
    useProfile.mockReturnValueOnce({
      ...mockProfileState,
      error: 'Passwords do not match',
    });

    renderComponent();

    const errorMessage = screen.getByText('Passwords do not match');
    expect(errorMessage).toBeInTheDocument();
  });
});
