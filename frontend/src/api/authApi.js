import axiosClient from './axios';

export const registerApi = async (userData) => {
  const response = await axiosClient.post('/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await axiosClient.post('/login', credentials);
  return response.data;
};

export const logoutApi = async () => {
  const response = await axiosClient.post('/logout');
  return response.data;
};

export const fetchMeApi = async () => {
  const response = await axiosClient.get('/me');
  return response.data;
};
