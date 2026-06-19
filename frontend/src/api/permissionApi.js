import axiosClient from './axios';

export const getPermissionsApi = async (params) => {
  const response = await axiosClient.get('/permissions', { params });
  return response.data;
};

export const getPermissionApi = async (id) => {
  const response = await axiosClient.get(`/permissions/${id}`);
  return response.data;
};

export const createPermissionApi = async (permissionData) => {
  const response = await axiosClient.post('/permissions', permissionData);
  return response.data;
};

export const updatePermissionApi = async (id, permissionData) => {
  const response = await axiosClient.put(`/permissions/${id}`, permissionData);
  return response.data;
};

export const deletePermissionApi = async (id) => {
  const response = await axiosClient.delete(`/permissions/${id}`);
  return response.data;
};
