import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { sendOtpApi } from '../../api/authApi';
import { loginWithOtpThunk } from '../../store/auth/authThunk';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { login, loading: authLoading, error: authError } = useAuth();

  // Tab state: 'password' | 'otp'
  const [loginMode, setLoginMode] = useState('password');

  // Password Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidationErrors, setPasswordValidationErrors] = useState({});

  // OTP Login state
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpValidationErrors, setOtpValidationErrors] = useState({});
  const [localError, setLocalError] = useState('');

  // Countdown timer logic for resend OTP
  useEffect(() => {
    let timer = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validate Password Login fields
  const validatePasswordForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setPasswordValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    login({ email, password });
  };

  // Validate OTP email or mobile field
  const handleSendOtp = async () => {
    setLocalError('');
    setOtpValidationErrors({});

    if (!emailOrMobile.trim()) {
      setOtpValidationErrors({ emailOrMobile: 'Email or Mobile is required' });
      return;
    }

    setSendingOtp(true);
    try {
      await sendOtpApi(emailOrMobile);
      setOtpSent(true);
      setCountdown(30); // 30 seconds wait timer
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to send OTP code. Ensure user is active.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Validate and submit OTP code
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setOtpValidationErrors({});

    if (!otp.trim()) {
      setOtpValidationErrors({ otp: 'Verification code is required' });
      return;
    }

    if (otp.length !== 6) {
      setOtpValidationErrors({ otp: 'Code must be exactly 6 digits' });
      return;
    }

    dispatch(loginWithOtpThunk({ email_or_mobile: emailOrMobile, otp }));
  };

  const activeTabClass = 'border-indigo-600 text-indigo-650 font-bold';
  const inactiveTabClass = 'border-transparent text-slate-500 hover:text-slate-700';

  return (
    <div className="space-y-6">
      {/* Login Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setLoginMode('password');
            setLocalError('');
          }}
          className={`flex-1 text-center py-2.5 text-sm border-b-2 font-medium transition cursor-pointer select-none ${
            loginMode === 'password' ? activeTabClass : inactiveTabClass
          }`}
        >
          Password Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMode('otp');
            setLocalError('');
          }}
          className={`flex-1 text-center py-2.5 text-sm border-b-2 font-medium transition cursor-pointer select-none ${
            loginMode === 'otp' ? activeTabClass : inactiveTabClass
          }`}
        >
          OTP Sign In
        </button>
      </div>

      {/* Forms Rendering */}
      {loginMode === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {authError && (
            <div className="bg-red-50 text-red-650 border border-red-200 px-4 py-2.5 rounded text-sm font-medium">
              {typeof authError === 'string' ? authError : 'Invalid email or password'}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-650 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={authLoading}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                passwordValidationErrors.email ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {passwordValidationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{passwordValidationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-650 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authLoading}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                passwordValidationErrors.password ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {passwordValidationErrors.password && (
              <p className="text-red-500 text-xs mt-1">{passwordValidationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition cursor-pointer shadow-sm"
          >
            {authLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          {(authError || localError) && (
            <div className="bg-red-50 text-red-655 border border-red-200 px-4 py-2.5 rounded text-sm font-medium">
              {authError || localError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-650 mb-1">Email or Mobile Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                disabled={otpSent || sendingOtp || authLoading}
                placeholder="email@example.com or +1234567890"
                className={`flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                  otpValidationErrors.emailOrMobile ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !emailOrMobile.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer transition select-none shadow-sm whitespace-nowrap"
                >
                  {sendingOtp ? 'Sending...' : 'Send OTP'}
                </button>
              )}
            </div>
            {otpValidationErrors.emailOrMobile && (
              <p className="text-red-500 text-xs mt-1">{otpValidationErrors.emailOrMobile}</p>
            )}
            {otpSent && (
              <p className="text-green-600 text-xs mt-1 font-semibold">
                ✓ OTP verification code has been dispatched.
              </p>
            )}
          </div>

          {otpSent && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-655 mb-1">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={authLoading}
                  placeholder="Enter 6-digit code"
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-mono text-lg tracking-widest ${
                    otpValidationErrors.otp ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {otpValidationErrors.otp && (
                  <p className="text-red-500 text-xs mt-1">{otpValidationErrors.otp}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition cursor-pointer shadow-sm"
              >
                {authLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <div className="text-center text-xs mt-3">
                {countdown > 0 ? (
                  <span className="text-slate-400">Resend code in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="text-indigo-650 hover:underline font-semibold cursor-pointer select-none"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default LoginForm;
