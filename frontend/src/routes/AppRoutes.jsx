import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Protection
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import VerifyEmailNotice from '../pages/Auth/VerifyEmailNotice';
import Profile from '../pages/Auth/Profile';
import Dashboard from '../pages/Dashboard';

// Users pages
import UserList from '../pages/Users/UserList';
import CreateUser from '../pages/Users/CreateUser';
import EditUser from '../pages/Users/EditUser';
import ViewUser from '../pages/Users/ViewUser';
import UserRoleAssignment from '../pages/Users/UserRoleAssignment';
import AuditLogs from '../pages/Audit/AuditLogs';

// Roles pages
import RoleList from '../pages/Roles/RoleList';
import CreateRole from '../pages/Roles/CreateRole';
import EditRole from '../pages/Roles/EditRole';

// Permissions pages
import PermissionList from '../pages/Permissions/PermissionList';
import CreatePermission from '../pages/Permissions/CreatePermission';
import EditPermission from '../pages/Permissions/EditPermission';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Main Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/verify-email" element={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <VerifyEmailNotice />
          </div>
        } />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/assign-roles" element={<UserRoleAssignment />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
          <Route path="/users/:id" element={<ViewUser />} />

          {/* Roles */}
          <Route path="/roles" element={<RoleList />} />
          <Route path="/roles/create" element={<CreateRole />} />
          <Route path="/roles/:id/edit" element={<EditRole />} />

          {/* Permissions */}
          <Route path="/permissions" element={<PermissionList />} />
          <Route path="/permissions/create" element={<CreatePermission />} />
          <Route path="/permissions/:id/edit" element={<EditPermission />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
