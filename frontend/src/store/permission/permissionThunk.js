import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPermissionsApi,
  getPermissionApi,
  createPermissionApi,
  updatePermissionApi,
  deletePermissionApi,
} from '../../api/permissionApi';

export const fetchPermissionsThunk = createAsyncThunk(
  'permission/fetchPermissions',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getPermissionsApi(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve permissions list'
      );
    }
  }
);

export const fetchPermissionThunk = createAsyncThunk(
  'permission/fetchPermission',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getPermissionApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve permission details'
      );
    }
  }
);

export const createPermissionThunk = createAsyncThunk(
  'permission/createPermission',
  async (permissionData, { rejectWithValue }) => {
    try {
      const data = await createPermissionApi(permissionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to create permission'
      );
    }
  }
);

export const updatePermissionThunk = createAsyncThunk(
  'permission/updatePermission',
  async ({ id, permissionData }, { rejectWithValue }) => {
    try {
      const data = await updatePermissionApi(id, permissionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to update permission'
      );
    }
  }
);

export const deletePermissionThunk = createAsyncThunk(
  'permission/deletePermission',
  async (id, { rejectWithValue }) => {
    try {
      await deletePermissionApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete permission'
      );
    }
  }
);
