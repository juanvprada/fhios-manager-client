import React from 'react';
import { render, screen } from '@testing-library/react';
import useFilteredProjects from '../../hooks/useFilteredProjects';

// Simula el componente de prueba
const HookWrapper = ({ projects, searchTerm, sortOrder }) => {
  const { filteredProjects } = useFilteredProjects(projects, searchTerm, sortOrder);
  return (
    <ul>
      {filteredProjects.map((project) => (
        <li key={project.project_id}>{project.project_name}</li>
      ))}
    </ul>
  );
};

describe('useFilteredProjects', () => {
  const projectsMock = [
    { project_id: 1, project_name: 'Alpha Project', created_at: '2023-01-01' },
    { project_id: 2, project_name: 'Beta Project', created_at: '2023-02-01' },
  ];

  test('should render an empty list if no projects match', () => {
    render(<HookWrapper projects={projectsMock} searchTerm="Gamma" sortOrder="asc" />);
    expect(screen.queryByRole('listitem')).toBeNull();
  });

  test('should render projects in ascending order by default', () => {
    render(<HookWrapper projects={projectsMock} searchTerm="" sortOrder="asc" />);
    const items = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(items).toEqual(['Alpha Project', 'Beta Project']);
  });

  test('should render filtered projects by search term', () => {
    render(<HookWrapper projects={projectsMock} searchTerm="alpha" sortOrder="asc" />);
    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
    expect(screen.queryByText('Beta Project')).not.toBeInTheDocument();
  });

  test('should render projects in descending order', () => {
    render(<HookWrapper projects={projectsMock} searchTerm="" sortOrder="desc" />);
    const items = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(items).toEqual(['Beta Project', 'Alpha Project']);
  });
});
