import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const MainLayout = () => {
  const { user, logout, hasPermission } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-indigo-600">EMS Portal</Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Dashboard</Link>
            {hasPermission('manage-users') && (
              <>
                <Link to="/users" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Users</Link>
                <Link to="/users/assign-roles" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Assign Roles</Link>
              </>
            )}
            {hasPermission('view-audit-logs') && (
              <Link to="/audit-logs" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Audit Trail</Link>
            )}
            {hasPermission('manage-roles') && (
              <Link to="/roles" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Roles</Link>
            )}
            {hasPermission('manage-permissions') && (
              <Link to="/permissions" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Permissions</Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="text-right hover:opacity-80 block transition">
            <div className="text-sm font-semibold text-slate-800">{user?.name || 'Employee'}</div>
            <div className="text-xs text-slate-500 hover:text-indigo-600 transition">{user?.email || 'authenticated'}</div>
          </Link>
          <button
            onClick={logout}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
