// src/__tests__/pages/RegisterForm.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../../pages/RegisterForm';

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Registro de Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellidos:')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Contraseña:')).toBeInTheDocument();
    expect(screen.getByText('Registrar usuario')).toBeInTheDocument();
  });
});
