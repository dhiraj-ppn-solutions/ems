import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoginForm from '../../components/Auth/LoginForm';

const Login = () => {
  const { isAuthenticated, clearErrors } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('success');

  useEffect(() => {
    clearErrors();
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setNotice('Your email has been verified successfully! You can now log in.');
      setNoticeType('success');
    } else if (searchParams.get('verification_failed') === 'true') {
      setNotice('Email verification link is invalid or has expired.');
      setNoticeType('error');
    } else if (searchParams.get('already_verified') === 'true') {
      setNotice('Your email is already verified. Please sign in.');
      setNoticeType('success');
    }

    if (location.state?.message) {
      setNotice(location.state.message);
      setNoticeType('success');
    }
  }, [searchParams, location]);

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500 text-sm">Please sign in to access your dashboard</p>
      </div>

      {notice && (
        <div className={`px-4 py-2.5 rounded text-sm mb-4 border ${
          noticeType === 'success'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-600 border-red-200'
        }`}>
          {noticeType === 'success' ? '✓ ' : '⚠ '} {notice}
        </div>
      )}

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
