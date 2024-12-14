import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserManagement from '../../pages/UserManagement';
import useUserManagement from '../../hooks/useUserManagement';

jest.mock('../../hooks/useUserManagement');

describe('UserManagement', () => {
  const mockData = {
    searchTerm: '',
    setSearchTerm: jest.fn(),
    sortOrder: 'asc',
    setSortOrder: jest.fn(),
    selectedUser: null,
    setSelectedUser: jest.fn(),
    showRoleModal: false,
    setShowRoleModal: jest.fn(),
    filteredUsers: [
      { user_id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', created_at: '2024-01-01' },
      { user_id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', created_at: '2024-01-02' },
    ],
    handleRoleChange: jest.fn(),
    showDeleteModal: false,
    setShowDeleteModal: jest.fn(),
    userToDelete: null,
    setUserToDelete: jest.fn(),
    handleDeleteUser: jest.fn(),
    loading: false,
    error: null,
    roles: [
      { role_id: 1, role_name: 'admin' },
      { role_id: 2, role_name: 'user' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUserManagement.mockReturnValue(mockData);
  });

  test('renders without crashing', () => {
    render(<UserManagement />);
    expect(screen.getByText(/Gestión de Usuarios/i)).toBeInTheDocument();
  });

  test('handles search term input', () => {
    render(<UserManagement />);
    const searchInput = screen.getByPlaceholderText(/Buscar usuarios.../i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    expect(mockData.setSearchTerm).toHaveBeenCalledWith('Jane');
  });

  test('handles sort order change', () => {
    render(<UserManagement />);
    const sortSelect = screen.getByDisplayValue(/Más antiguos primero/i);
    fireEvent.change(sortSelect, { target: { value: 'desc' } });
    expect(mockData.setSortOrder).toHaveBeenCalledWith('desc');
  });
});
