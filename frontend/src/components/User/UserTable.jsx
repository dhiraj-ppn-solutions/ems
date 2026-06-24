import React from 'react';

const UserTable = ({ users, onSort, sortBy, sortOrder, onEdit, onDelete, onView, onToggleStatus }) => {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th
              onClick={() => onSort('id')}
              className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
            >
              ID{renderSortIndicator('id')}
            </th>
            <th
              onClick={() => onSort('name')}
              className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
            >
              Name{renderSortIndicator('name')}
            </th>
            <th
              onClick={() => onSort('email')}
              className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
            >
              Email Address{renderSortIndicator('email')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Role
            </th>
            <th
              onClick={() => onSort('created_at')}
              className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none"
            >
              Registered Date{renderSortIndicator('created_at')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200 text-sm text-slate-700">
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-500 text-xs">
                  #{user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.roles && user.roles[0]?.name === 'Super Admin'
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : user.roles && user.roles[0]?.name === 'Admin'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {user.roles && user.roles[0]?.name || 'Employee'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleStatus(user.id, user)}
                    className="focus:outline-none transition hover:opacity-80"
                  >
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border cursor-pointer select-none ${
                      user.is_active !== false
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {user.is_active !== false ? '● Active' : '○ Inactive'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => onView(user.id)}
                    className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(user.id)}
                    className="text-amber-600 hover:text-amber-900 text-xs font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.id, user.name)}
                    className="text-red-600 hover:text-red-900 text-xs font-semibold transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
