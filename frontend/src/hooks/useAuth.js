import { useSelector, useDispatch } from 'react-redux';
import { loginThunk, registerThunk, logoutThunk, fetchMeThunk } from '../store/auth/authThunk';
import { clearError } from '../store/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: (credentials) => dispatch(loginThunk(credentials)),
    register: (userData) => dispatch(registerThunk(userData)),
    logout: () => dispatch(logoutThunk()),
    fetchMe: () => dispatch(fetchMeThunk()),
    clearErrors: () => dispatch(clearError()),
  };
};

export default useAuth;
