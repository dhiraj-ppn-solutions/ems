import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRolesThunk,
  fetchRoleThunk,
  createRoleThunk,
  updateRoleThunk,
  deleteRoleThunk,
  syncRolePermissionsThunk,
} from './roleThunk';

const initialState = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
    clearRoleErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRolesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data;
      })
      .addCase(fetchRolesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Role
      .addCase(fetchRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRole = action.payload.data;
      })
      .addCase(fetchRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Role
      .addCase(createRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload.data);
      })
      .addCase(createRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Role
      .addCase(updateRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRole = action.payload.data;
        state.roles = state.roles.map((r) =>
          r.id === action.payload.data.id ? action.payload.data : r
        );
      })
      .addCase(updateRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Role
      .addCase(deleteRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Sync Role Permissions
      .addCase(syncRolePermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncRolePermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRole = action.payload.data;
        state.roles = state.roles.map((r) =>
          r.id === action.payload.data.id ? action.payload.data : r
        );
      })
      .addCase(syncRolePermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedRole, clearRoleErrors } = roleSlice.actions;
export default roleSlice.reducer;
