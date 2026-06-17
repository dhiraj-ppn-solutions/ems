import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import RegisterForm from '../../components/Auth/RegisterForm';

const Register = () => {
  const { isAuthenticated, clearErrors } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    clearErrors();
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    setSuccess(true);
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
        <p className="text-slate-500 text-sm">Sign up as an employee to get started</p>
      </div>

      {success ? (
        <div className="text-center space-y-4">
          <div className="bg-green-50 text-green-600 border border-green-200 px-4 py-3 rounded text-sm">
            Account created successfully! You can now sign in.
          </div>
          <Link
            to="/login"
            className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition text-center"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <>
          <RegisterForm onSuccess={handleSuccess} />
          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default Register;
