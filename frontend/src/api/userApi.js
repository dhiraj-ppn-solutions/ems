import axiosClient from './axios';

export const getUsersApi = async (params) => {
  const response = await axiosClient.get('/users', { params });
  return response.data;
};

export const getUserApi = async (id) => {
  const response = await axiosClient.get(`/users/${id}`);
  return response.data;
};

export const createUserApi = async (userData) => {
  const response = await axiosClient.post('/users', userData);
  return response.data;
};

export const updateUserApi = async (id, userData) => {
  const response = await axiosClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUserApi = async (id) => {
  const response = await axiosClient.delete(`/users/${id}`);
  return response.data;
};

export const assignUserRoleApi = async (id, roleName) => {
  const response = await axiosClient.post(`/users/${id}/role`, { role: roleName });
  return response.data;
};

export const toggleUserStatusApi = async (id) => {
  const response = await axiosClient.put(`/users/${id}/status`);
  return response.data;
};
