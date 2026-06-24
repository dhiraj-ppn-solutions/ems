import axiosClient from './axios';

export const fetchDashboardStatsApi = async () => {
  const response = await axiosClient.get('/dashboard');
  return response.data;
};
