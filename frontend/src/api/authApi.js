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

export const forgotPasswordApi = async (email) => {
  const response = await axiosClient.post('/forgot-password', { email });
  return response.data;
};

export const resetPasswordApi = async (payload) => {
  const response = await axiosClient.post('/reset-password', payload);
  return response.data;
};

export const resendVerificationApi = async () => {
  const response = await axiosClient.post('/email/verification-notification');
  return response.data;
};

export const sendOtpApi = async (emailOrMobile) => {
  const response = await axiosClient.post('/send-otp', { email_or_mobile: emailOrMobile });
  return response.data;
};

export const verifyOtpApi = async (emailOrMobile, otp) => {
  const response = await axiosClient.post('/verify-otp', { email_or_mobile: emailOrMobile, otp });
  return response.data;
};

export const loginWithOtpApi = async (emailOrMobile, otp) => {
  const response = await axiosClient.post('/login-with-otp', { email_or_mobile: emailOrMobile, otp });
  return response.data;
};
