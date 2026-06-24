import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { fetchDashboardStatsApi } from '../api/dashboardApi';

// Helper to format timestamps into relative or readable times
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Helper for event log styling
const getEventBadgeStyles = (event) => {
  const name = event || '';
  if (name.includes('CREATE') || name.includes('UPLOAD')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  }
  if (name.includes('DELETE')) {
    return 'bg-rose-50 text-rose-700 border-rose-100';
  }
  if (name.includes('UPDATE') || name.includes('ASSIGN')) {
    return 'bg-sky-50 text-sky-700 border-sky-100';
  }
  if (name.includes('LOGIN') || name.includes('LOGOUT')) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  }
  if (name.includes('STATUS') || name.includes('CHANGE')) {
    return 'bg-amber-50 text-amber-700 border-amber-100';
  }
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const Dashboard = () => {
  const { user, hasRole, hasPermission } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasDashboardPerm =
    hasPermission('manage-users') ||
    hasPermission('view-audit-logs') ||
    hasPermission('manage-roles') ||
    hasPermission('manage-permissions') ||
    hasPermission('view-dashboard');

  useEffect(() => {
    if (hasDashboardPerm) {
      const getStats = async () => {
        setLoading(true);
        try {
          const data = await fetchDashboardStatsApi();
          setStats(data);
        } catch (err) {
          console.error('Failed to load dashboard statistics:', err);
        } finally {
          setLoading(false);
        }
      };
      getStats();
    }
  }, [hasDashboardPerm]);

  // Loading skeleton placeholder
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Welcome banner skeleton */}
        <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
        {/* KPI Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        {/* Distribution & Timeline skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-64 bg-slate-200 rounded-2xl lg:col-span-1"></div>
          <div className="h-64 bg-slate-200 rounded-2xl lg:col-span-2"></div>
        </div>
      </div>
    );
  }

  // Render for standard visitor (User role)
  if (hasRole('User')) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 rounded-2xl p-8 text-white shadow-xl border border-indigo-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              Tour Account
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">Welcome, System Explorer!</h1>
            <p className="text-indigo-200/90 text-sm mt-3 leading-relaxed">
              You are logged in as a public explorer. This environment showcases the capabilities of our Employee Management System (EMS). Use the guide cards below to explore how administrators manage roles, permissions, and directories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="bg-indigo-50 text-indigo-650 rounded-xl p-3.5 w-fit mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Employee Directory</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Experience full pagination, live search filters, sorting headers, and account statuses. Administrators can edit profiles and manage dynamic designations.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="bg-purple-50 text-purple-650 rounded-xl p-3.5 w-fit mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Access Control (RBAC)</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Super Admins can assign system permissions and sync roles dynamically. Role changes immediately restrict or permit API access fields.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="bg-rose-50 text-rose-650 rounded-xl p-3.5 w-fit mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Security Enforcement</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Prevents privilege escalation and self-deletion. standard administrators are blocked from elevating users to Super Admin roles, keeping user roles secure.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-250/60 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="bg-amber-100 text-amber-800 rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
            i
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">Explorer Account Limits</h4>
            <p className="text-xs text-amber-700/90 mt-1 leading-relaxed">
              Because you are logged in under a public tour credential, administrative panels (Users, Roles, Permissions directories) are disabled in your navigation. Full privileges are unlocked when logging in with authorized credentials created by the System Administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showDistribution = stats && stats.role_distribution && stats.role_distribution.length > 0;
  const showActivity = stats && stats.recent_activity;

  // Percentage calculations
  const totalUsers = stats?.metrics?.total_users || 0;
  const activeUsers = stats?.metrics?.active_users || 0;
  const activePercentage = totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Dynamic Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            Active Session
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back, {user?.name || 'Employee'}!</h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            You are logged in under system administration. Here is the real-time breakdown of employees, system privileges, and recent security logs.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg relative z-10">
          {user?.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="w-14 h-14 rounded-full border-2 border-indigo-400 object-cover shadow-md" />
          ) : (
            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black text-xl border-2 border-indigo-400 shadow-inner select-none">
              {user?.name ? user.name[0].toUpperCase() : 'E'}
            </div>
          )}
          <div>
            <div className="text-[10px] text-indigo-200 uppercase font-black tracking-wider">Current Security Role</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {user?.roles?.[0]?.name || 'Employee'}
            </div>
            <span className="text-[10px] text-indigo-300 font-medium">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {stats && stats.metrics && Object.keys(stats.metrics).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Employees Card */}
          {stats.metrics.total_users !== undefined && (
            <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Employees</span>
                  <span className="text-3xl font-black text-slate-800 mt-2 block">{stats.metrics.total_users}</span>
                </div>
                <div className="bg-indigo-50 text-indigo-600 rounded-xl p-2 group-hover:bg-indigo-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs">
                <span>Active Ratio</span>
                <span className="font-semibold text-indigo-650">{activePercentage}%</span>
              </div>
            </div>
          )}

          {/* Active Employees Card */}
          {stats.metrics.active_users !== undefined && (
            <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Employees</span>
                  <span className="text-3xl font-black text-emerald-600 mt-2 block">{stats.metrics.active_users}</span>
                </div>
                <div className="bg-emerald-50 text-emerald-600 rounded-xl p-2 group-hover:bg-emerald-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50">
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${activePercentage}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Inactive Employees Card */}
          {stats.metrics.inactive_users !== undefined && (
            <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inactive</span>
                  <span className="text-3xl font-black text-rose-550 mt-2 block">{stats.metrics.inactive_users}</span>
                </div>
                <div className="bg-rose-50 text-rose-550 rounded-xl p-2 group-hover:bg-rose-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs">
                <span>Inactivity Rate</span>
                <span className="font-semibold text-rose-600">{100 - activePercentage}%</span>
              </div>
            </div>
          )}

          {/* Total Roles Card */}
          {stats.metrics.total_roles !== undefined && (
            <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Roles</span>
                  <span className="text-3xl font-black text-amber-600 mt-2 block">{stats.metrics.total_roles}</span>
                </div>
                <div className="bg-amber-50 text-amber-600 rounded-xl p-2 group-hover:bg-amber-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-slate-450 text-xs">
                <Link to="/roles" className="text-amber-700 hover:underline font-semibold flex items-center gap-0.5">
                  Manage Roles &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Total Permissions Card */}
          {stats.metrics.total_permissions !== undefined && (
            <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permissions</span>
                  <span className="text-3xl font-black text-violet-600 mt-2 block">{stats.metrics.total_permissions}</span>
                </div>
                <div className="bg-violet-50 text-violet-600 rounded-xl p-2 group-hover:bg-violet-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-3.436-5.844l-1.562.78c-1.424.712-2.136 1.068-2.613 1.763a4 4 0 00-.73 1.706c-.161.94-.038 1.745.207 3.356l.044.29a3.54 3.54 0 01-.89 2.766L3.3 19.382a1.5 1.5 0 001.077 2.56h2.955a1.5 1.5 0 001.328-.809l1.106-2.212a.5.5 0 01.447-.276h.885c.19 0 .347-.134.385-.32l.277-1.385a.5.5 0 01.49-.402h.885c.19 0 .347-.134.385-.32l.332-1.662c.046-.227.246-.388.477-.388h.426a3.54 3.54 0 012.766-.89l.29.044c1.61.245 2.417.368 3.357.207a4 4 0 001.706-.73c.695-.477 1.05-1.19 1.762-2.613l.78-1.562a6.002 6.002 0 00-8.84-8.84z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-slate-450 text-xs">
                <Link to="/permissions" className="text-violet-750 hover:underline font-semibold flex items-center gap-0.5">
                  View Privileges &rarr;
                </Link>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Graphs, Timeline & Sidebar controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics Charts and Mini Profile */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* User Role Distribution Panel */}
          {showDistribution && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                  User Role Distribution
                </h2>
                <div className="space-y-4">
                  {stats.role_distribution.map((dist, idx) => {
                    const pct = totalUsers ? Math.round((dist.users_count / totalUsers) * 100) : 0;
                    
                    // Assign colors dynamically based on role name
                    let barColor = 'from-indigo-500 to-blue-500';
                    let dotColor = 'bg-indigo-500';
                    if (dist.name.includes('Super')) {
                      barColor = 'from-rose-500 to-red-500';
                      dotColor = 'bg-rose-500';
                    } else if (dist.name.includes('Admin')) {
                      barColor = 'from-amber-500 to-yellow-500';
                      dotColor = 'bg-amber-500';
                    } else if (dist.name.includes('Employee')) {
                      barColor = 'from-emerald-500 to-teal-500';
                      dotColor = 'bg-emerald-500';
                    }

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                            {dist.name}
                          </span>
                          <span className="text-slate-500 font-mono font-medium">
                            {dist.users_count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${barColor} h-2 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* User Profile Mini Widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Profile Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 shadow-inner">
                  👤
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Registered Name</div>
                  <div className="text-sm font-semibold text-slate-800 truncate">{user?.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 shadow-inner">
                  ✉
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Email Address</div>
                  <div className="text-sm font-semibold text-slate-800 truncate">{user?.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 shadow-inner">
                  📞
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Mobile Phone</div>
                  <div className="text-sm font-semibold text-slate-800 truncate">{user?.mobile || 'Not configured'}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
              <Link to="/profile" className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-700 py-1.5 px-3 rounded-lg text-xs font-semibold transition">
                Edit Profile
              </Link>
              {hasPermission('manage-users') && (
                <Link to="/users" className="flex-1 text-center bg-slate-800 hover:bg-slate-900 border border-slate-900 text-white py-1.5 px-3 rounded-lg text-xs font-semibold transition">
                  Directory
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Security Timeline Log Feed */}
        {showActivity && (
          <div className={showDistribution ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Security Operations Timeline
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">Real-time system events and administrative updates.</p>
                </div>
                {hasPermission('view-audit-logs') && (
                  <Link to="/audit-logs" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5">
                    View Trail &rarr;
                  </Link>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-[480px] p-6 relative">
                {stats.recent_activity.length > 0 ? (
                  <div className="relative border-l border-slate-200/80 ml-3.5 space-y-6">
                    {stats.recent_activity.map((activity) => {
                      const badgeStyle = getEventBadgeStyles(activity.event);
                      
                      // Get shorthand visual icon representing audit events
                      let operatorIcon = '⚙️';
                      if (activity.event.includes('LOGIN')) operatorIcon = '🔐';
                      else if (activity.event.includes('LOGOUT')) operatorIcon = '🚪';
                      else if (activity.event.includes('CREATE')) operatorIcon = '➕';
                      else if (activity.event.includes('DELETE')) operatorIcon = '❌';
                      else if (activity.event.includes('UPDATE')) operatorIcon = '✏️';
                      else if (activity.event.includes('STATUS')) operatorIcon = '⚡';

                      return (
                        <div key={activity.id} className="relative pl-6 group">
                          {/* Timeline node dot wrapper */}
                          <div className="absolute -left-[14px] top-0.5 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-xs shadow-sm group-hover:border-indigo-500 transition-colors z-10">
                            {operatorIcon}
                          </div>

                          <div className="bg-slate-50/30 border border-slate-100 hover:border-slate-200/80 p-4 rounded-xl hover:bg-slate-50/60 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800">
                                {activity.user ? activity.user.name : 'System/Guest'}
                              </span>
                              <span className="text-[10px] text-slate-450 font-semibold font-mono bg-white px-2 py-0.5 rounded border border-slate-100 shrink-0 shadow-sm">
                                {formatRelativeTime(activity.created_at)}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed break-words">{activity.description}</p>
                            
                            <div className="flex flex-wrap gap-2 items-center mt-3 pt-3 border-t border-slate-100">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle}`}>
                                {activity.event}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                IP: {activity.ip_address || '127.0.0.1'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">⏳</span>
                    <span>No security events have been logged yet.</span>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
