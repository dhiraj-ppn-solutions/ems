import React from 'react';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

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
