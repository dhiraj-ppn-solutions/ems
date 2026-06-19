import axiosClient from './axios';

export const getRolesApi = async (params) => {
  const response = await axiosClient.get('/roles', { params });
  return response.data;
};

export const getRoleApi = async (id) => {
  const response = await axiosClient.get(`/roles/${id}`);
  return response.data;
};

export const createRoleApi = async (roleData) => {
  const response = await axiosClient.post('/roles', roleData);
  return response.data;
};

export const updateRoleApi = async (id, roleData) => {
  const response = await axiosClient.put(`/roles/${id}`, roleData);
  return response.data;
};

export const deleteRoleApi = async (id) => {
  const response = await axiosClient.delete(`/roles/${id}`);
  return response.data;
};

export const syncRolePermissionsApi = async (id, permissionData) => {
  const response = await axiosClient.post(`/roles/${id}/permissions`, permissionData);
  return response.data;
};
