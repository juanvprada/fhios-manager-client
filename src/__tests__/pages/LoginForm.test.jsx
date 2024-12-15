import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../pages/LoginForm';
import useStore from '../../store/store';

// Mock axios
jest.mock('axios');

// Mock useStore
jest.mock('../../store/store', () => ({
  __esModule: true,
  default: jest.fn(() => ({ login: jest.fn() })),
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.mockReturnValue({ login: mockLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderComponent = () => render(<LoginForm />);

  test('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  test('shows error on login failure', async () => {
    renderComponent();

    // Mock login error response
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Credenciales incorrectas' } },
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Correo electrónico:'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña:'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText('Iniciar sesión'));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });

    // Ensure no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows error on profile fetch failure', async () => {
    renderComponent();

    const mockToken = 'mockToken';
    const mockRole = 'user';

    axios.post.mockResolvedValueOnce({
      data: { token: mockToken, role: mockRole },
    });

    axios.get.mockRejectedValueOnce(new Error('Error fetching profile'));

    fireEvent.change(screen.getByLabelText('Correo electrónico:'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña:'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Iniciar sesión'));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Error al obtener información del usuario')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
