import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import roleService from '../../services/roleService';
import userService from '../../services/userService';
import { fetchUsersThunk } from '../../store/user/userThunk';
import UserSearch from '../../components/User/UserSearch';
import UserPagination from '../../components/User/UserPagination';

const UserRoleAssignment = () => {
  const dispatch = useDispatch();
  const { user: currentUser, hasRole, hasPermission, loading: authLoading } = useAuth();
  const { users, loading, pagination } = useSelector((state) => state.user);
  const { roles } = useSelector((state) => state.role);

  // Filter and pagination states
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Status state for updates: { [userId]: { status: 'idle' | 'loading' | 'success' | 'error', message: string } }
  const [updateStatuses, setUpdateStatuses] = useState({});

  const hasManageUsers = hasPermission('manage-users');

  // Load roles on mount
  useEffect(() => {
    if (!authLoading && hasManageUsers) {
      roleService.fetchRoles();
    }
  }, [authLoading, hasManageUsers]);

  // Fetch users when parameters change
  useEffect(() => {
    if (!authLoading && hasManageUsers) {
      dispatch(fetchUsersThunk({ search, sort_by: sortBy, sort_order: sortOrder, page }));
    }
  }, [dispatch, search, sortBy, sortOrder, page, authLoading, hasManageUsers]);

  if (!authLoading && !hasManageUsers) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRoleChange = async (userId, targetUser, newRoleName) => {
    // Clear previous status
    setUpdateStatuses((prev) => ({
      ...prev,
      [userId]: { status: 'loading', message: '' },
    }));

    try {
      const resultAction = await userService.assignRole(userId, newRoleName);
      if (userService.assignRole.rejected?.match(resultAction) || resultAction.error) {
        const errorMsg = resultAction.payload || 'Failed to update role';
        setUpdateStatuses((prev) => ({
          ...prev,
          [userId]: { status: 'error', message: errorMsg },
        }));
      } else {
        setUpdateStatuses((prev) => ({
          ...prev,
          [userId]: { status: 'success', message: 'Role assigned successfully!' },
        }));
        // Dismiss success message after 3 seconds
        setTimeout(() => {
          setUpdateStatuses((prev) => ({
            ...prev,
            [userId]: { status: 'idle', message: '' },
          }));
        }, 3000);
      }
    } catch (err) {
      setUpdateStatuses((prev) => ({
        ...prev,
        [userId]: { status: 'error', message: err.message || 'An error occurred' },
      }));
    }
  };

  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  // Helper to determine if the current user can change the role of targetUser
  const canModifyRoleOf = (targetUser) => {
    if (!currentUser) return false;

    // A user cannot change their own role (prevents self-lockout)
    if (currentUser.id === targetUser.id) return false;

    const targetUserRole = targetUser.roles?.[0]?.name;

    // Super Admin can change anyone else's role
    if (hasRole('Super Admin')) return true;

    // Admin can only change roles for users who are NOT Super Admin or Admin themselves
    if (hasRole('Admin')) {
      return targetUserRole !== 'Super Admin' && targetUserRole !== 'Admin';
    }

    return false;
  };

  // Helper to get allowed role options for current user to assign
  const getAllowedRoles = () => {
    if (hasRole('Super Admin')) {
      return roles;
    }
    if (hasRole('Admin')) {
      // Admins can only assign Employee or User roles
      return roles.filter((r) => r.name === 'Employee' || r.name === 'User');
    }
    return [];
  };

  const allowedRoles = getAllowedRoles();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Role Assignment</h1>
          <p className="text-slate-500 text-sm">Assign and manage system security roles for employees.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <UserSearch onSearch={handleSearch} />
      </div>

      {loading && users.length === 0 ? (
        <div className="text-center py-10 text-slate-500 animate-pulse text-sm">
          Loading user roles directory...
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    onClick={() => handleSort('id')}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                  >
                    ID{renderSortIndicator('id')}
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                  >
                    Name{renderSortIndicator('name')}
                  </th>
                  <th
                    onClick={() => handleSort('email')}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
                  >
                    Email Address{renderSortIndicator('email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                    Assign New Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-sm text-slate-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => {
                    const userRole = userItem.roles?.[0]?.name || 'Employee';
                    const isEditable = canModifyRoleOf(userItem);
                    const statusInfo = updateStatuses[userItem.id] || { status: 'idle', message: '' };

                    return (
                      <tr key={userItem.id} className="hover:bg-slate-55/50">
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-500 text-xs">
                          #{userItem.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                          {userItem.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {userItem.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            userRole === 'Super Admin'
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : userRole === 'Admin'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : userRole === 'Employee'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {userRole}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={userRole}
                            onChange={(e) => handleRoleChange(userItem.id, userItem, e.target.value)}
                            disabled={!isEditable || statusInfo.status === 'loading'}
                            className={`text-sm border rounded px-2 py-1 bg-white focus:outline-none focus:border-indigo-550 min-w-[130px] ${
                              !isEditable
                                ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                                : 'border-slate-300 text-slate-800'
                            }`}
                          >
                            {/* If the current role is not in the allowed roles list, display it as disabled option */}
                            {!allowedRoles.some((r) => r.name === userRole) && (
                              <option value={userRole} disabled>{userRole}</option>
                            )}
                            {allowedRoles.map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {statusInfo.status === 'loading' && (
                            <span className="text-slate-500 flex items-center gap-1.5 animate-pulse">
                              <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                              Updating...
                            </span>
                          )}
                          {statusInfo.status === 'success' && (
                            <span className="text-green-600 font-medium">
                              ✓ Saved
                            </span>
                          )}
                          {statusInfo.status === 'error' && (
                            <span className="text-red-500 font-medium max-w-[200px] truncate block" title={statusInfo.message}>
                              ⚠ {statusInfo.message}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <UserPagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default UserRoleAssignment;
