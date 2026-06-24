import axiosClient from './axios';

export const updateProfileApi = async (profileData) => {
  const response = await axiosClient.put('/profile', profileData);
  return response.data;
};

export const updatePasswordApi = async (passwordData) => {
  const response = await axiosClient.put('/profile/password', passwordData);
  return response.data;
};

export const uploadAvatarApi = async (formData) => {
  const response = await axiosClient.post('/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
