import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginThunk, registerThunk, logoutThunk, fetchMeThunk } from '../store/auth/authThunk';
import { clearError } from '../store/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const hasRole = useCallback((roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => role.name === roleName);
  }, [user]);

  const hasPermission = useCallback((permissionName) => {
    if (!user) return false;
    const hasDirect = user.permissions?.some((p) => p.name === permissionName);
    if (hasDirect) return true;
    const hasRolePerm = user.roles?.some((role) =>
      role.permissions?.some((p) => p.name === permissionName)
    );
    return !!hasRolePerm;
  }, [user]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    hasRole,
    hasPermission,
    login: (credentials) => dispatch(loginThunk(credentials)),
    register: (userData) => dispatch(registerThunk(userData)),
    logout: () => dispatch(logoutThunk()),
    fetchMe: () => dispatch(fetchMeThunk()),
    clearErrors: () => dispatch(clearError()),
  };
};

export default useAuth;
