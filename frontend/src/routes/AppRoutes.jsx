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
import Dashboard from '../pages/Dashboard';

// Users pages
import UserList from '../pages/Users/UserList';
import CreateUser from '../pages/Users/CreateUser';
import EditUser from '../pages/Users/EditUser';
import ViewUser from '../pages/Users/ViewUser';

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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
          <Route path="/users/:id" element={<ViewUser />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
