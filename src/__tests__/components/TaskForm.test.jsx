import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../../components/TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockAvailableUsers = [
    { user_id: 1, name: 'User One' },
    { user_id: 2, name: 'User Two' },
    { user_id: 3, name: 'User Three' },
  ];

  const renderTaskForm = () => {
    return render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        availableUsers={mockAvailableUsers}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    renderTaskForm();
    expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha límite')).toBeInTheDocument();
    expect(screen.getByLabelText('Prioridad')).toBeInTheDocument();
    expect(screen.getByLabelText('Horas estimadas')).toBeInTheDocument();
    expect(screen.getByText('Asignar a')).toBeInTheDocument();
    expect(screen.getByText('Crear Tarea')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    renderTaskForm();
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('updates form fields correctly', () => {
    renderTaskForm();

    const titleInput = screen.getByLabelText('Título');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    expect(titleInput.value).toBe('Test Task');

    const descriptionTextarea = screen.getByLabelText('Descripción');
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });
    expect(descriptionTextarea.value).toBe('Test Description');

    const dateInput = screen.getByLabelText('Fecha límite');
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    expect(dateInput.value).toBe('2024-12-31');

    const prioritySelect = screen.getByLabelText('Prioridad');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    expect(prioritySelect.value).toBe('high');

    const hoursInput = screen.getByLabelText('Horas estimadas');
    fireEvent.change(hoursInput, { target: { value: '5' } });
    expect(hoursInput.value).toBe('5');
  });

  test('handles user selection correctly', () => {
    renderTaskForm();
  
    // Seleccionar usuarios usando data-testid en lugar de texto
    const checkboxUserOne = screen.getByTestId('checkbox-user-1');
    const checkboxUserTwo = screen.getByTestId('checkbox-user-2');
  
    // Seleccionar "User One" y "User Two"
    fireEvent.click(checkboxUserOne);
    fireEvent.click(checkboxUserTwo);
  
    // Verificar que aparecen en la lista de usuarios seleccionados
    expect(screen.getByTestId('selected-user-1')).toBeInTheDocument();
    expect(screen.getByTestId('selected-user-2')).toBeInTheDocument();
  
    // Eliminar "User One"
    fireEvent.click(screen.getByText('Eliminar', { selector: '[data-testid="selected-user-1"] button' }));
  
    // Verificar que "User One" ya no está en la lista
    expect(screen.queryByTestId('selected-user-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('selected-user-2')).toBeInTheDocument();
  });
  

  test('does not call onSubmit if required fields are empty', () => {
    renderTaskForm();

    fireEvent.click(screen.getByText('Crear Tarea'));
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});

