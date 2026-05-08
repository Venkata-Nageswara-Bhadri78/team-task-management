import api from './axios';

export const getDashboardSummaryApi = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getProjectDashboardApi = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/dashboard`);
  return response.data;
};
