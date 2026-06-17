import { store } from '../store';
import { loginThunk, registerThunk, logoutThunk, fetchMeThunk } from '../store/auth/authThunk';
import { clearError } from '../store/auth/authSlice';

export const authService = {
  login: (credentials) => store.dispatch(loginThunk(credentials)),
  register: (userData) => store.dispatch(registerThunk(userData)),
  logout: () => store.dispatch(logoutThunk()),
  fetchMe: () => store.dispatch(fetchMeThunk()),
  clearErrors: () => store.dispatch(clearError()),
};

export default authService;
