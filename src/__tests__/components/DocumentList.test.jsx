import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentList from '../../components/DocumentList';
import useStore from '../../store/store';
import { downloadDocument } from '../../services/documentServices';
import { getUsers } from '../../services/usersServices';

// Mock de useStore
jest.mock('../../store/store', () => jest.fn());
jest.mock('../../services/documentServices', () => ({
  downloadDocument: jest.fn(),
}));
jest.mock('../../services/usersServices', () => ({
  getUsers: jest.fn(),
}));

describe('DocumentList', () => {
  const mockOnDeleteDocument = jest.fn();

  const mockDocuments = [
    {
      document_id: 1,
      title: 'Document 1',
      created_at: '2024-12-01T10:00:00Z',
      uploaded_by: 1,
    },
    {
      document_id: 2,
      title: 'Document 2',
      created_at: '2024-12-02T11:00:00Z',
      uploaded_by: 2,
    },
  ];

  const mockDescriptions = {
    1: 'Document description <!--HOURS:2.5-->',
    2: 'Another description <!--HOURS:3.0-->',
  };

  const mockTask = {
    estimated_hours: 10,
  };

  const mockUsers = [
    { user_id: 1, name: 'User 1' },
    { user_id: 2, name: 'User 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.mockReturnValue({ role: 'admin' });
    getUsers.mockResolvedValue(mockUsers);
  });

  const renderComponent = (props = {}) => {
    return render(
      <DocumentList
        documents={mockDocuments}
        descriptions={mockDescriptions}
        task={mockTask}
        onDeleteDocument={mockOnDeleteDocument}
        {...props}
      />
    );
  };

  test('renders documents correctly', async () => {
    renderComponent();

    // Verificar la cantidad de documentos renderizados
    expect(screen.getByText('Document 1')).toBeInTheDocument();
    expect(screen.getByText('Document 2')).toBeInTheDocument();

    // Verificar descripciones limpias
    expect(screen.getByText('Document description')).toBeInTheDocument();
    expect(screen.getByText('Another description')).toBeInTheDocument();

    // Verificar usuarios
    expect(await screen.findByText('Subido por: User 1')).toBeInTheDocument();
    expect(await screen.findByText('Subido por: User 2')).toBeInTheDocument();
  });

  test('calculates hours correctly', () => {
    renderComponent();

    // Verificar las horas estimadas, registradas y restantes
    expect(screen.getByText('Horas Estimadas:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Horas Registradas:')).toBeInTheDocument();
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('Horas Restantes:')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('handles document download', async () => {
    renderComponent();

    const downloadButton = screen.getAllByTitle('Descargar documento')[0];
    fireEvent.click(downloadButton);

    // Verificar que downloadDocument fue llamado con el ID correcto
    expect(downloadDocument).toHaveBeenCalledWith(1);
    expect(downloadDocument).toHaveBeenCalledTimes(1);
  });

  test('renders empty state when no documents are present', () => {
    renderComponent({ documents: [] });

    // Verificar que se muestra el mensaje de "No hay documentos adjuntos"
    expect(screen.getByText('No hay documentos adjuntos')).toBeInTheDocument();
  });
});

