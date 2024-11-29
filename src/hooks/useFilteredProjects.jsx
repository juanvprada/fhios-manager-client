import { useMemo } from "react";

const projects = [
  { id: 1, name: "Proyecto Alpha", createdAt: new Date("2022-01-15"), creator: "Juan" },
  { id: 2, name: "Proyecto Beta", createdAt: new Date("2023-05-10"), creator: "María" },
  { id: 3, name: "Proyecto Gamma", createdAt: new Date("2021-09-12"), creator: "Carlos" },
];

const useFilteredProjects = (searchTerm, sortOrder) => {
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.createdAt - b.createdAt;
        } else {
          return b.createdAt - a.createdAt;
        }
      });
  }, [searchTerm, sortOrder]);

  return { filteredProjects };
};

export default useFilteredProjects;

