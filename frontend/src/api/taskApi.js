import api from './axios';

export const getProjectTasksApi = async (projectId, filters = {}) => {
  const response = await api.get(`/projects/${projectId}/tasks`, {
    params: filters,
  });
  return response.data;
};

export const createTaskApi = async (projectId, payload) => {
  const response = await api.post(`/projects/${projectId}/tasks`, payload);
  return response.data;
};

export const getTaskDetailsApi = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const updateTaskApi = async (taskId, payload) => {
  const response = await api.put(`/tasks/${taskId}`, payload);
  return response.data;
};

export const updateTaskStatusApi = async (taskId, status) => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data;
};

export const deleteTaskApi = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const getMyTasksApi = async () => {
  const response = await api.get('/tasks/my-tasks');
  return response.data;
};
