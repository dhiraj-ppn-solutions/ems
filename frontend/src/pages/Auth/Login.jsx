import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoginForm from '../../components/Auth/LoginForm';

const Login = () => {
  const { isAuthenticated, clearErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearErrors();
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500 text-sm">Please sign in to access your dashboard</p>
      </div>

      <LoginForm />

      <p className="text-center text-xs text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 hover:underline font-medium">
          Create account
        </Link>
      </p>
      <div className="text-center text-xs mt-2">
        <Link to="/forgot-password" className="text-indigo-500 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
