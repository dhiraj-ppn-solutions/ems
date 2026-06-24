import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = () => {
    if (!email) {
      setValidationError('Email is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await forgotPasswordApi(email);
      setSuccess(response.message || 'Reset link sent! Please check your email inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset link. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h1>
        <p className="text-slate-500 text-sm">Enter your registered email address, and we will send you a secure link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2.5 rounded text-sm font-medium">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded text-sm">
            ⚠ {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
              validationError ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="name@example.com"
          />
          {validationError && (
            <p className="text-red-500 text-xs mt-1">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition cursor-pointer"
        >
          {loading ? 'Sending Link...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-indigo-600 hover:underline text-sm font-medium">
          &larr; Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
