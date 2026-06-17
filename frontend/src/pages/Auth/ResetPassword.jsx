import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h1>
      <p className="text-slate-500 text-sm mb-6">Choose a new password for your account.</p>
      
      <div className="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2 rounded text-xs mb-4">
        Password reset feature is not implemented in the current API.
      </div>

      <Link to="/login" className="text-indigo-600 hover:underline text-sm font-medium">
        Back to Sign In
      </Link>
    </div>
  );
};

export default ResetPassword;
