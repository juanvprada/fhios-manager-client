import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import CreateRole from '../../pages/CreateRole';
import { createRole } from '../../services/rolesServices';

// Mock the `useNavigate` hook
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock the `createRole` service
jest.mock('../../services/rolesServices', () => ({
  createRole: jest.fn(),
}));

describe('CreateRole', () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderComponent = () => render(<CreateRole />);

  test('renders correctly', () => {
    renderComponent();

    // Check the presence of key elements
    expect(screen.getByText('Crear Nuevo Rol')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del Rol *')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Crear Rol')).toBeInTheDocument();
  });

  test('navigates back when cancel button is clicked', () => {
    renderComponent();

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('displays an error when required fields are empty', async () => {
    renderComponent();

    const submitButton = screen.getByText('Crear Rol');
    fireEvent.click(submitButton);

    // Verify no call to the `createRole` service
    expect(createRole).not.toHaveBeenCalled();
  });

  test('submits the form with valid data', async () => {
    renderComponent();

    const roleNameInput = screen.getByLabelText('Nombre del Rol *');
    const descriptionInput = screen.getByLabelText('Descripción');
    const submitButton = screen.getByText('Crear Rol');

    // Fill out the form
    fireEvent.change(roleNameInput, { target: { value: 'Manager' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Responsible for team management' },
    });

    // Mock successful submission
    createRole.mockResolvedValueOnce();

    fireEvent.click(submitButton);

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(createRole).toHaveBeenCalledWith({
        role_name: 'Manager',
        description: 'Responsible for team management',
      });
      expect(createRole).toHaveBeenCalledTimes(1);

      // Verify navigation after successful submission
      expect(mockNavigate).toHaveBeenCalledWith('/roles');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  test('displays an error when form submission fails', async () => {
    renderComponent();

    const roleNameInput = screen.getByLabelText('Nombre del Rol *');
    const descriptionInput = screen.getByLabelText('Descripción');
    const submitButton = screen.getByText('Crear Rol');

    // Fill out the form
    fireEvent.change(roleNameInput, { target: { value: 'Manager' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Responsible for team management' },
    });

    // Mock an error response
    createRole.mockRejectedValueOnce({
      response: { data: { message: 'Error al crear el rol' } },
    });

    fireEvent.click(submitButton);

    // Wait for the error to appear
    await waitFor(() => {
      expect(screen.getByText('Error al crear el rol')).toBeInTheDocument();
    });

    // Verify no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
