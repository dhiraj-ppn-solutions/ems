import { createSlice } from '@reduxjs/toolkit';
import { registerThunk, loginThunk, logoutThunk, fetchMeThunk, loginWithOtpThunk } from './authThunk';
import { getToken } from '../../utils/token';

const initialState = {
  user: null,
  token: getToken() || '',
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.token = '';
      state.isAuthenticated = false;
      state.error = null;
    },
    updateCurrentUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token = '';
        state.isAuthenticated = false;
      })

      // Login with OTP
      .addCase(loginWithOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginWithOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.token = '';
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = '';
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = '';
        state.isAuthenticated = false;
      })

      // Fetch Me (Hydration)
      .addCase(fetchMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = '';
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAuthState, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
