import React, { useState, useEffect } from 'react';

const AssignPermissionModal = ({
  isOpen,
  onClose,
  onConfirm,
  roleName,
  assignedPermissions = [],
  allPermissions = [],
  loading = false,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedPermissions(assignedPermissions.map((p) => p.name));
      setSearchQuery('');
    }
  }, [isOpen, assignedPermissions]);

  if (!isOpen) return null;

  const handleTogglePermission = (name) => {
    if (selectedPermissions.includes(name)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== name));
    } else {
      setSelectedPermissions([...selectedPermissions, name]);
    }
  };

  const handleSelectAll = () => {
    setSelectedPermissions(allPermissions.map((p) => p.name));
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleSave = () => {
    onConfirm(selectedPermissions);
  };

  const filteredPermissions = allPermissions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Assign Permissions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Assigning capabilities to role: <strong className="text-indigo-600 font-semibold">{roleName}</strong></p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg transition"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Filter / Quick actions */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3">
          <input
            type="text"
            className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              disabled={loading}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-slate-500 hover:text-slate-700 font-medium"
              disabled={loading}
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Permissions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredPermissions.length === 0 ? (
            <p className="text-center py-6 text-slate-400 text-xs italic">
              {searchQuery ? 'No permissions match your search.' : 'No permissions available.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPermissions.map((perm) => {
                const isChecked = selectedPermissions.includes(perm.name);
                return (
                  <label
                    key={perm.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded border transition cursor-pointer text-xs select-none ${
                      isChecked
                        ? 'border-indigo-200 bg-indigo-50/50 text-indigo-950 font-medium'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      checked={isChecked}
                      onChange={() => handleTogglePermission(perm.name)}
                      disabled={loading}
                    />
                    <span>{perm.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignPermissionModal;
