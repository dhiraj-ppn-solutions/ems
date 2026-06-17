import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const RegisterForm = ({ onSuccess }) => {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register({ name, email, password });
    if (!result.error && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded text-sm">
          {typeof error === 'string' ? error : 'Registration failed. Check details.'}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
            validationErrors.name ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {validationErrors.name && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
            validationErrors.email ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {validationErrors.email && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 characters"
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
            validationErrors.password ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {validationErrors.password && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
            validationErrors.confirmPassword ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {validationErrors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;
