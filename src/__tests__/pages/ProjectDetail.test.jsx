import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectDetail from '../../pages/ProjectDetail';
import useStore from '../../store/store';
import { getProjectById } from '../../services/projectServices';
import { getProjectTasks } from '../../services/taskServices';
import { getUsers } from '../../services/usersServices';

// Mocking dependencies
jest.mock('../../store/store', () => jest.fn());
jest.mock('../../services/projectServices', () => ({
  getProjectById: jest.fn(),
}));
jest.mock('../../services/taskServices', () => ({
  getProjectTasks: jest.fn(),
}));
jest.mock('../../services/usersServices', () => ({
  getUsers: jest.fn(),
}));

describe('ProjectDetail', () => {
  const mockProject = {
    project_id: 1,
    project_name: 'Test Project',
    description: 'A test project',
    created_at: '2024-01-01T00:00:00Z',
    created_by: 1,
    methodology: 'SCRUM',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    assignedUsers: [1, 2],
  };
  const mockTasks = [
    {
      task_id: 1,
      title: 'Task 1',
      description: 'First task',
      due_date: '2024-06-01',
      priority: 'high',
      assignedUsers: [1],
    },
    {
      task_id: 2,
      title: 'Task 2',
      description: 'Second task',
      due_date: '2024-07-01',
      priority: 'medium',
      assignedUsers: [2],
    },
  ];
  const mockUsers = [
    { user_id: 1, name: 'User One' },
    { user_id: 2, name: 'User Two' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useStore.mockReturnValue({
      isAuthenticated: true,
      token: 'mockToken',
      role: 'admin',
    });
    getProjectById.mockResolvedValue(mockProject);
    getProjectTasks.mockResolvedValue(mockTasks);
    getUsers.mockResolvedValue(mockUsers);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/projects/1']}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

  test('renders tasks', async () => {
    renderComponent();

    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    useStore.mockReturnValueOnce({
      isAuthenticated: true,
      token: 'mockToken',
      role: 'admin',
    });

    const { getByText } = renderComponent();

    expect(getByText('Cargando proyecto...')).toBeInTheDocument();
  });

  test('displays error message on failure', async () => {
    getProjectById.mockRejectedValueOnce(new Error('Error fetching project data'));

    renderComponent();

    expect(await screen.findByText('Error al cargar los datos del proyecto. Por favor, intenta de nuevo.')).toBeInTheDocument();
  });
});

