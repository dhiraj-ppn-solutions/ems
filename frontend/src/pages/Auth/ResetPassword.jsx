import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../api/authApi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(!token || !email ? 'Invalid or expired password reset link. Please request a new one.' : '');
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!password) {
      errors.password = 'New password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }
    if (password !== passwordConfirmation) {
      errors.passwordConfirmation = 'Passwords do not match.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !email) {
      setError('Missing token or email. Request a new password reset link.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await resetPasswordApi({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(response.message || 'Your password has been successfully reset.');
      setPassword('');
      setPasswordConfirmation('');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful! Sign in with your new password.' } });
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h1>
        <p className="text-slate-500 text-sm">Create a new secure password for your account.</p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2.5 rounded text-sm mb-4 font-medium">
          ✓ {success} Redirecting to login...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded text-sm mb-4">
          ⚠ {error}
        </div>
      )}

      {token && email && !success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                validationErrors.password ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Min 8 characters"
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={loading}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                validationErrors.passwordConfirmation ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Confirm new password"
            />
            {validationErrors.passwordConfirmation && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.passwordConfirmation}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition cursor-pointer"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link to="/login" className="text-indigo-600 hover:underline text-sm font-medium">
          &larr; Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
