import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-slate-200 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
