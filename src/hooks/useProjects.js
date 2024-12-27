// hooks/useProjects.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store/store';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useStore((state) => state.token);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const projectsData = response.data.data || [];
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  return { projects, loading, error };
};

export default useProjects;