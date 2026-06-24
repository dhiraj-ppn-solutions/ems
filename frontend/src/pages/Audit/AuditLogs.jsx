import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { fetchAuditLogsApi, exportAuditLogsApi } from '../../api/auditApi';

const AuditLogs = () => {
  const { hasPermission, loading: authLoading } = useAuth();

  if (!authLoading && !hasPermission('view-audit-logs')) {
    return <Navigate to="/dashboard" replace />;
  }

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Filtering & Pagination state
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const filters = {
        search,
        event: eventFilter,
        start_date: startDate,
        end_date: endDate,
        page,
        per_page: 15
      };
      
      const response = await fetchAuditLogsApi(filters);
      setLogs(response.data || []);
      setTotalPages(response.last_page || 1);
      setTotalItems(response.total || 0);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, eventFilter, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleReset = () => {
    setSearch('');
    setEventFilter('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const filters = {
        search,
        event: eventFilter,
        start_date: startDate,
        end_date: endDate
      };
      const blob = await exportAuditLogsApi(filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ems_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Audit Trail</h1>
          <p className="text-slate-500 text-sm">Track security actions, user operations, and administrative event logs.</p>
        </div>
        
        <button
          onClick={handleExport}
          disabled={exporting || logs.length === 0}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer shrink-0 shadow-sm"
        >
          {exporting ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-white rounded-full animate-ping"></span>
              Exporting...
            </span>
          ) : (
            <>
              <span>📥</span>
              <span>Export CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Search Keywords</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Description, User, IP..."
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Action Type</label>
            <select
              value={eventFilter}
              onChange={(e) => {
                setEventFilter(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">All Events</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="USER_CREATE">USER_CREATE</option>
              <option value="USER_UPDATE">USER_UPDATE</option>
              <option value="USER_DELETE">USER_DELETE</option>
              <option value="ROLE_ASSIGN">ROLE_ASSIGN</option>
              <option value="PROFILE_UPDATE">PROFILE_UPDATE</option>
              <option value="PASSWORD_UPDATE">PASSWORD_UPDATE</option>
              <option value="AVATAR_UPLOAD">AVATAR_UPLOAD</option>
              <option value="USER_STATUS_CHANGE">USER_STATUS_CHANGE</option>
              <option value="OTP_REQUEST">OTP_REQUEST</option>
              <option value="EXPORT">EXPORT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-1.5 px-3 rounded text-sm font-medium transition cursor-pointer"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="border border-slate-300 hover:bg-slate-50 text-slate-600 py-1.5 px-3 rounded text-sm font-medium transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-lg py-16 text-center text-slate-500 animate-pulse text-sm">
          Loading audit events feed...
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-6 py-3 text-left tracking-wider w-16">ID</th>
                  <th className="px-6 py-3 text-left tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left tracking-wider">Operator</th>
                  <th className="px-6 py-3 text-left tracking-wider w-36">Event</th>
                  <th className="px-6 py-3 text-left tracking-wider">Action Description</th>
                  <th className="px-6 py-3 text-left tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-sm text-slate-700">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      No matching audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                    if (log.event.includes('CREATE') || log.event.includes('UPLOAD')) {
                      badgeClass = 'bg-green-50 text-green-700 border-green-100';
                    } else if (log.event.includes('DELETE')) {
                      badgeClass = 'bg-red-50 text-red-700 border-red-100';
                    } else if (log.event.includes('UPDATE')) {
                      badgeClass = 'bg-blue-50 text-blue-700 border-blue-100';
                    } else if (log.event.includes('LOGIN')) {
                      badgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                    } else if (log.event.includes('CHANGE')) {
                      badgeClass = 'bg-amber-50 text-amber-700 border-amber-100';
                    }

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-400 text-xs">
                          #{log.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">
                          {log.user ? (
                            <div>
                              <div>{log.user.name}</div>
                              <div className="text-xs text-slate-400 font-normal">{log.user.email}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">System / Guest</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass}`}>
                            {log.event}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 max-w-md">
                          {log.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-500">
                          {log.ip_address || '127.0.0.1'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing page <span className="font-semibold text-slate-700">{page}</span> of <span className="font-semibold text-slate-700">{totalPages}</span> ({totalItems} logs total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-white border border-slate-350 hover:bg-slate-50 disabled:opacity-50 px-3 py-1 text-xs rounded font-medium cursor-pointer transition select-none"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-white border border-slate-350 hover:bg-slate-50 disabled:opacity-50 px-3 py-1 text-xs rounded font-medium cursor-pointer transition select-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
