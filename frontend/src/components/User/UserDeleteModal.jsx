import React from 'react';

const UserDeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-800/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg border border-slate-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Confirm Deletion</h3>
        <p className="text-sm text-slate-600">
          Are you sure you want to delete user <span className="font-semibold text-slate-900">{userName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
