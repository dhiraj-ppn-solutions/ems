import React from 'react';

const RoleTable = ({ roles, onEdit, onDelete, onAssignPermissions }) => {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Role Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Assigned Permissions
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200 text-sm text-slate-700">
          {roles.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                No roles found.
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr key={role.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-500 text-xs">
                  #{role.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                  {role.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-md">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((perm) => (
                        <span
                          key={perm.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                        >
                          {perm.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic">No permissions assigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                  <button
                    onClick={() => onAssignPermissions(role.id, role.name, role.permissions || [])}
                    className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold transition"
                  >
                    Assign Permissions
                  </button>
                  <button
                    onClick={() => onEdit(role.id)}
                    className="text-amber-600 hover:text-amber-900 text-xs font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(role.id, role.name)}
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

export default RoleTable;
