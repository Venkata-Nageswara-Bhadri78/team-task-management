import { useState, useEffect, useCallback } from 'react';
import { getProjectsApi } from '../api/projectApi';
import getErrorMessage from '../utils/getErrorMessage';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProjectsApi();
      setProjects(response.data?.projects || response.data || []);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, fetchProjects };
};

export default useProjects;
