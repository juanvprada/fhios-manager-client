import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when open', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    // Verificar que el título y el mensaje predeterminados se muestran
    expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
    expect(
      screen.getByText(
        '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.'
      )
    ).toBeInTheDocument();

    // Verificar que los botones están presentes
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<DeleteConfirmationModal {...defaultProps} isOpen={false} />);

    // Asegurarse de que nada se renderiza
    expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument();
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
  });

  test('calls onClose when the cancel button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    // Verificar que se llama a onClose
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when the confirm button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    const confirmButton = screen.getByText('Eliminar');
    fireEvent.click(confirmButton);

    // Verificar que se llama a onConfirm
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('renders with custom title, message, and button texts', () => {
    const customProps = {
      ...defaultProps,
      title: 'Custom Title',
      message: 'Custom message for deletion confirmation.',
      confirmText: 'Yes, Delete',
      cancelText: 'No, Cancel',
    };

    render(<DeleteConfirmationModal {...customProps} />);

    // Verificar que se muestran los textos personalizados
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message for deletion confirmation.')).toBeInTheDocument();
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    expect(screen.getByText('No, Cancel')).toBeInTheDocument();
  });
});
