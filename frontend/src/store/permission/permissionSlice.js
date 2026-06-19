import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPermissionsThunk,
  fetchPermissionThunk,
  createPermissionThunk,
  updatePermissionThunk,
  deletePermissionThunk,
} from './permissionThunk';

const initialState = {
  permissions: [],
  selectedPermission: null,
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    clearSelectedPermission: (state) => {
      state.selectedPermission = null;
    },
    clearPermissionErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Permissions
      .addCase(fetchPermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.data;
      })
      .addCase(fetchPermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Permission
      .addCase(fetchPermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPermission = action.payload.data;
      })
      .addCase(fetchPermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Permission
      .addCase(createPermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.push(action.payload.data);
      })
      .addCase(createPermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Permission
      .addCase(updatePermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPermission = action.payload.data;
        state.permissions = state.permissions.map((p) =>
          p.id === action.payload.data.id ? action.payload.data : p
        );
      })
      .addCase(updatePermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Permission
      .addCase(deletePermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = state.permissions.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedPermission, clearPermissionErrors } = permissionSlice.actions;
export default permissionSlice.reducer;
