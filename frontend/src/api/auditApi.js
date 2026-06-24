import axiosClient from './axios';

export const fetchAuditLogsApi = async (filters = {}) => {
  const response = await axiosClient.get('/audit-logs', { params: filters });
  return response.data;
};

export const exportAuditLogsApi = async (filters = {}) => {
  const response = await axiosClient.get('/audit-logs/export', {
    params: filters,
    responseType: 'blob',
  });
  return response.data;
};
