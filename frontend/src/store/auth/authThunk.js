import { createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi, loginApi, logoutApi, fetchMeApi, loginWithOtpApi } from '../../api/authApi';
import { setToken, removeToken } from '../../utils/token';

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerApi(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Registration failed'
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Login failed'
      );
    }
  }
);

export const loginWithOtpThunk = createAsyncThunk(
  'auth/loginWithOtp',
  async ({ email_or_mobile, otp }, { rejectWithValue }) => {
    try {
      const data = await loginWithOtpApi(email_or_mobile, otp);
      setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'OTP login failed'
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      removeToken();
      return null;
    } catch (error) {
      removeToken();
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

export const fetchMeThunk = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchMeApi();
      return data;
    } catch (error) {
      removeToken();
      return rejectWithValue(
        error.response?.data?.message || 'Failed to authenticate user session'
      );
    }
  }
);
