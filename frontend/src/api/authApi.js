import api from './axios';

export const signupApi = async (payload) => {
  const response = await api.post('/auth/signup', payload);
  return response.data;
};

export const loginApi = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
