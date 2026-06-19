import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRolesApi,
  getRoleApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  syncRolePermissionsApi,
} from '../../api/roleApi';

export const fetchRolesThunk = createAsyncThunk(
  'role/fetchRoles',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getRolesApi(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve roles list'
      );
    }
  }
);

export const fetchRoleThunk = createAsyncThunk(
  'role/fetchRole',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getRoleApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve role details'
      );
    }
  }
);

export const createRoleThunk = createAsyncThunk(
  'role/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      const data = await createRoleApi(roleData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to create role'
      );
    }
  }
);

export const updateRoleThunk = createAsyncThunk(
  'role/updateRole',
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const data = await updateRoleApi(id, roleData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to update role'
      );
    }
  }
);

export const deleteRoleThunk = createAsyncThunk(
  'role/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await deleteRoleApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete role'
      );
    }
  }
);

export const syncRolePermissionsThunk = createAsyncThunk(
  'role/syncRolePermissions',
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const data = await syncRolePermissionsApi(id, { permissions });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to sync permissions'
      );
    }
  }
);
