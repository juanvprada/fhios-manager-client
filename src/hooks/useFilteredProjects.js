import { useMemo } from "react";

const useFilteredProjects = (projects = [], searchTerm, sortOrder) => {
  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];

    return projects
      .filter((project) =>
        project.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
  }, [projects, searchTerm, sortOrder]);

  return { filteredProjects };
};

export default useFilteredProjects;


