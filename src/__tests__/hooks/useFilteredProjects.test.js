import { render, screen } from '@testing-library/react';
import useFilteredProjects from '../../hooks/useFilteredProjects';

const HookWrapper = ({ projects, searchTerm, sortOrder }) => {
  const { filteredProjects } = useFilteredProjects(projects, searchTerm, sortOrder);
  return (
    <div>
      {filteredProjects.map((project) => (
        <div key={project.project_id}>{project.project_name}</div>
      ))}
    </div>
  );
};

describe('useFilteredProjects', () => {
  const projectsMock = [
    { project_id: 1, project_name: 'Project A', created_at: '2024-01-01' },
    { project_id: 2, project_name: 'Project B', created_at: '2024-01-02' },
    { project_id: 3, project_name: 'Alpha Project', created_at: '2024-01-03' },
  ];

  test('should render filtered projects by search term', () => {
    render(<HookWrapper projects={projectsMock} searchTerm="alpha" sortOrder="asc" />);
    expect(screen.getByText('Alpha Project')).toBeInTheDocument();
  });

  test('should render projects in ascending order by default', () => {
    render(<HookWrapper projects={projectsMock} searchTerm="" sortOrder="asc" />);
    expect(screen.getAllByText(/Project/).map((el) => el.textContent)).toEqual([
      'Project A',
      'Project B',
      'Alpha Project',
    ]);
  });

  test('should render an empty list if no projects match', () => {
    render(<HookWrapper projects={projectsMock} searchTerm="notfound" sortOrder="asc" />);
    expect(screen.queryByText(/Project/)).not.toBeInTheDocument();
  });
});
