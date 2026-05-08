import api from './axios';

export const getProjectsApi = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProjectDetailsApi = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const createProjectApi = async (payload) => {
  const response = await api.post('/projects', payload);
  return response.data;
};

export const updateProjectApi = async (projectId, payload) => {
  const response = await api.put(`/projects/${projectId}`, payload);
  return response.data;
};

export const deleteProjectApi = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

export const addProjectMemberApi = async (projectId, payload) => {
  const response = await api.post(`/projects/${projectId}/members`, payload);
  return response.data;
};

export const removeProjectMemberApi = async (projectId, userId) => {
  const response = await api.delete(`/projects/${projectId}/members/${userId}`);
  return response.data;
};
