import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { resendVerificationApi } from '../../api/authApi';

const VerifyEmailNotice = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await resendVerificationApi();
      setSuccess(response.message || 'Verification link resent successfully! Check your email inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg border border-slate-200 shadow-sm text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4 text-indigo-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Verify Your Email</h1>
        <p className="text-slate-500 text-sm">
          A verification link was sent to <strong className="text-slate-700">{user?.email}</strong>. Please click on the link in the email to verify your identity and activate your account.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2.5 rounded text-sm mb-4 font-medium">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded text-sm mb-4">
          ⚠ {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition cursor-pointer"
        >
          {loading ? 'Resending Link...' : 'Resend Verification Email'}
        </button>

        <button
          onClick={logout}
          className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded text-sm font-medium transition cursor-pointer"
        >
          Sign Out & Return to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;
