import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Projects from '../../pages/Projects';
import useProjects from '../../hooks/useProject';
import { useNavigate } from 'react-router-dom';

// Mock useProjects
jest.mock('../../hooks/useProject', () => jest.fn());

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Projects', () => {
  const mockNavigate = jest.fn();
  const mockProjects = [
    {
      project_id: 1,
      project_name: 'Project Alpha',
      description: 'First project description',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      methodology: 'Scrum',
    },
    {
      project_id: 2,
      project_name: 'Project Beta',
      description: '',
      status: 'planning',
      created_at: '2024-02-01T00:00:00Z',
      methodology: 'Kanban',
    },
  ];

  const mockUseProjects = {
    filteredProjects: mockProjects,
    loading: false,
    error: '',
    searchTerm: '',
    setSearchTerm: jest.fn(),
    sortOrder: 'asc',
    setSortOrder: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useProjects.mockReturnValue(mockUseProjects);
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

  test('renders error message when there is an error', () => {
    useProjects.mockReturnValueOnce({ ...mockUseProjects, error: 'Failed to fetch projects' });
    renderComponent();

    expect(screen.getByText('Failed to fetch projects')).toBeInTheDocument();
  });

  test('renders projects correctly', () => {
    renderComponent();

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('First project description')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText(/Scrum/i)).toBeInTheDocument();

    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Sin descripción')).toBeInTheDocument();
    expect(screen.getByText('planning')).toBeInTheDocument();
    expect(screen.getByText(/Kanban/i)).toBeInTheDocument();
  });

  test('calls setSearchTerm when search input is changed', () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Buscar proyectos...');
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });

    expect(mockUseProjects.setSearchTerm).toHaveBeenCalledWith('Alpha');
  });

  test('calls setSortOrder when sort select is changed', () => {
    renderComponent();

    const sortSelect = screen.getByDisplayValue('Más antiguos primero');
    fireEvent.change(sortSelect, { target: { value: 'desc' } });

    expect(mockUseProjects.setSortOrder).toHaveBeenCalledWith('desc');
  });

  test('navigates to project details on project card click', () => {
    renderComponent();

    const projectCard = screen.getByText('Project Alpha');
    fireEvent.click(projectCard);

    expect(mockNavigate).toHaveBeenCalledWith('/projects/1');
  });

  test('renders empty state when there are no projects', () => {
    useProjects.mockReturnValueOnce({ ...mockUseProjects, filteredProjects: [] });
    renderComponent();

    expect(screen.getByText('No se encontraron proyectos.')).toBeInTheDocument();
  });
});
