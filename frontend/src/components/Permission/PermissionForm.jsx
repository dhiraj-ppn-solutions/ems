import React, { useState, useEffect } from 'react';

const PermissionForm = ({ initialData, onSubmit, onCancel, loading, serverErrors }) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
    }
  }, [initialData]);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Permission name is required.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ name });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div>
        <label htmlFor="permission-name" className="block text-sm font-semibold text-slate-700 mb-1">
          Permission Name
        </label>
        <input
          type="text"
          id="permission-name"
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name || serverErrors?.name ? 'border-red-500' : 'border-slate-300'
          }`}
          placeholder="e.g., delete-users, edit-settings"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        {(errors.name || serverErrors?.name) && (
          <p className="mt-1 text-xs text-red-600">
            {errors.name || (Array.isArray(serverErrors.name) ? serverErrors.name[0] : serverErrors.name)}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Permission'}
        </button>
      </div>
    </form>
  );
};

export default PermissionForm;
