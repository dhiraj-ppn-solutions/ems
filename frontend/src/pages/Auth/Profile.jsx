import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { updateProfileApi, updatePasswordApi, uploadAvatarApi } from '../../api/profileApi';
import { updateCurrentUser } from '../../store/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  // Profile fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  
  // Loading & notification states
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileValidationErrors, setProfileValidationErrors] = useState({});

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordValidationErrors, setPasswordValidationErrors] = useState({});

  // Avatar upload state
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const [avatarError, setAvatarError] = useState('');

  // Hydrate fields on user load
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  // Profile validation
  const validateProfile = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required.';
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    setProfileValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const response = await updateProfileApi({ name, email, mobile });
      const updatedUser = response.data; // User details returned from UserResource
      
      // Sync local redux auth store state
      dispatch(updateCurrentUser(updatedUser));
      
      setProfileSuccess('Personal details updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Password validation
  const validatePassword = () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required.';
    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters.';
    }
    if (newPassword !== newPasswordConfirmation) {
      errors.newPasswordConfirmation = 'Passwords do not match.';
    }
    setPasswordValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const response = await updatePasswordApi({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });

      setPasswordSuccess(response.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirmation('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password. Check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Avatar file upload handler
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image size must be less than 2MB.');
      return;
    }

    setAvatarLoading(true);
    setAvatarSuccess('');
    setAvatarError('');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await uploadAvatarApi(formData);
      dispatch(updateCurrentUser(response.user.data));
      setAvatarSuccess('Avatar updated successfully!');
      setTimeout(() => setAvatarSuccess(''), 3000);
    } catch (err) {
      setAvatarError(err.response?.data?.message || 'Failed to upload avatar image.');
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account information and password settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Avatar Upload Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 w-full text-left pb-2 border-b border-slate-100">
            Profile Picture
          </h2>

          <div className="relative group mb-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full border border-slate-350 object-cover shadow-sm transition group-hover:opacity-75"
              />
            ) : (
              <div className="w-32 h-32 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full flex items-center justify-center font-bold text-4xl shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'E'}
              </div>
            )}
            
            {avatarLoading && (
              <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                <span className="text-xs text-indigo-650 font-semibold animate-pulse">Uploading...</span>
              </div>
            )}
          </div>

          <label className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded text-xs font-semibold cursor-pointer transition w-full block text-center select-none shadow-sm">
            <span>📷 Choose Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={avatarLoading}
              className="hidden"
            />
          </label>
          <span className="text-[10px] text-slate-400 mt-2 block">Supported: JPEG, PNG, JPG, WEBP. Max 2MB.</span>

          {avatarSuccess && (
            <p className="text-green-600 text-xs mt-3 font-semibold">✓ {avatarSuccess}</p>
          )}
          {avatarError && (
            <p className="text-red-500 text-xs mt-3 font-semibold">⚠ {avatarError}</p>
          )}
        </div>

        {/* Middle column: Personal Details */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Details
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {profileSuccess && (
              <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded text-sm font-medium">
                ✓ {profileSuccess}
              </div>
            )}

            {profileError && (
              <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded text-sm">
                ⚠ {profileError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={profileLoading}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                  profileValidationErrors.name ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {profileValidationErrors.name && (
                <p className="text-red-500 text-xs mt-1">{profileValidationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={profileLoading}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                  profileValidationErrors.email ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {profileValidationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{profileValidationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={profileLoading}
                placeholder="Enter mobile phone number"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Security Role</label>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {user?.roles?.[0]?.name || 'Employee'}
              </span>
              <p className="text-slate-400 text-xs mt-1.5">Roles are managed by system administrators.</p>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition cursor-pointer shadow-sm"
            >
              {profileLoading ? 'Saving Info...' : 'Update Details'}
            </button>
          </form>
        </div>

        {/* Right column: Change Password Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordSuccess && (
              <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded text-sm font-medium">
                ✓ {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded text-sm">
                ⚠ {passwordError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={passwordLoading}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                  passwordValidationErrors.currentPassword ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter current password"
              />
              {passwordValidationErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordValidationErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={passwordLoading}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                  passwordValidationErrors.newPassword ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Min 8 characters"
              />
              {passwordValidationErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordValidationErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                disabled={passwordLoading}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${
                  passwordValidationErrors.newPasswordConfirmation ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Re-enter new password"
              />
              {passwordValidationErrors.newPasswordConfirmation && (
                <p className="text-red-500 text-xs mt-1">{passwordValidationErrors.newPasswordConfirmation}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 rounded text-sm font-medium transition cursor-pointer shadow-sm"
            >
              {passwordLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
