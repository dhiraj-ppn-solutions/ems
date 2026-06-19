import React from 'react';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user, hasRole } = useAuth();

  if (hasRole('User')) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-md">
          <h1 className="text-3xl font-extrabold">Welcome, System Explorer!</h1>
          <p className="text-indigo-100 text-sm mt-2 max-w-2xl">
            You are logged in as a public explorer user. This account is designed for visitors to tour and learn about the Employee Management System (EMS).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="bg-indigo-50 text-indigo-600 rounded-lg p-3 w-fit mb-4">
                <span className="text-xl font-bold">👥</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Employee Directory</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Add, search, sort, and paginate employee directories. Admins can update designations, email coordinates, and access roles dynamically.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="bg-purple-50 text-purple-600 rounded-lg p-3 w-fit mb-4">
                <span className="text-xl font-bold">🔑</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Access Control (RBAC)</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Define distinct privilege roles and actions. Super Admins can map specific permission sets to roles dynamically via checkbox panels.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="bg-amber-50 text-amber-600 rounded-lg p-3 w-fit mb-4">
                <span className="text-xl font-bold">🛡️</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Security Escalation Gates</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Prevents privilege escalation. Standard Admins are blocked from promoting anyone to Admin/Super Admin, and self-deletion is strictly blocked.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start gap-4">
          <div className="bg-amber-100 text-amber-700 rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
            ℹ
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-800">Visitor Account Limits</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Because you are logged in as a public explorer user, administrative modules (Users, Roles, Permissions list) are hidden from your navigation bar. Real employee profiles, organization charts, and security settings can only be managed by authentic internal Employee or Admin credentials created explicitly by the System Administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name || 'Employee'}!</h1>
        <p className="text-slate-500 text-sm mt-1">Here is a quick overview of your Employee Account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
            Account Profile
          </h2>
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Employee Name</span>
              <span className="text-sm text-slate-700">{user?.name}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Email Address</span>
              <span className="text-sm text-slate-700">{user?.email}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">System ID</span>
              <span className="text-sm font-mono text-slate-700">#{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
            Session Details
          </h2>
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Authentication Mode</span>
              <span className="text-xs inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium px-2 py-0.5 rounded mt-0.5">
                Laravel Sanctum Tokens
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Registered Date</span>
              <span className="text-sm text-slate-700">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
