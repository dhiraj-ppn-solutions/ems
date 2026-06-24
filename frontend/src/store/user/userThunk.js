import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUsersApi,
  getUserApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  assignUserRoleApi,
} from '../../api/userApi';

export const fetchUsersThunk = createAsyncThunk(
  'user/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getUsersApi(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve user directory'
      );
    }
  }
);

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUser',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getUserApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve user details'
      );
    }
  }
);

export const createUserThunk = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await createUserApi(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to add user'
      );
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(id, userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to update user'
      );
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await deleteUserApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

export const assignUserRoleThunk = createAsyncThunk(
  'user/assignRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const data = await assignUserRoleApi(id, role);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to assign role'
      );
    }
  }
);
