import React from 'react';

const PermissionTable = ({ permissions, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Permission Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Guard
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200 text-sm text-slate-700">
          {permissions.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                No permissions found.
              </td>
            </tr>
          ) : (
            permissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-500 text-xs">
                  #{perm.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                  {perm.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                  {perm.guard_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                  <button
                    onClick={() => onEdit(perm.id)}
                    className="text-amber-600 hover:text-amber-900 text-xs font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(perm.id, perm.name)}
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

export default PermissionTable;
