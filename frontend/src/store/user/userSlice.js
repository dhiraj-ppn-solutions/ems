import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUsersThunk,
  fetchUserThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from './userThunk';

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUserErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.total_pages,
          total: action.payload.meta.total,
          perPage: action.payload.meta.per_page,
        };
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single User
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.data;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create User
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.data;
        state.users = state.users.map((u) =>
          u.id === action.payload.data.id ? action.payload.data : u
        );
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedUser, clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
