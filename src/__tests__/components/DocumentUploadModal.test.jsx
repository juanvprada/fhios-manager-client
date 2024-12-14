import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentUploadModal from '../../components/DocumentUploadModal';

describe('DocumentUploadModal', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  const renderComponent = () =>
    render(
      <DocumentUploadModal taskId={1} onSubmit={mockOnSubmit} onClose={mockOnClose} />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    renderComponent();

    // Verificar la presencia de los elementos principales
    expect(screen.getByText('Subir Documento')).toBeInTheDocument();
    expect(screen.getByText('Seleccionar archivo')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Subir')).toBeInTheDocument();
  });

  test('handles file selection', () => {
    renderComponent();

    const fileInput = screen.getByLabelText('Seleccionar archivo');
    const mockFile = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Verificar que el nombre del archivo se muestra
    expect(screen.getByText('example.pdf')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Cancelar'));

    // Verificar que se llama a onClose
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
