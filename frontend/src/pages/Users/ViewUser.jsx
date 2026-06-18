import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchUserThunk } from '../../store/user/userThunk';
import { clearSelectedUser } from '../../store/user/userSlice';

const ViewUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserThunk(id));

    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, id]);

  if (loading && !selectedUser) {
    return (
      <div className="text-center py-10 text-slate-500 animate-pulse text-sm">
        Loading employee profile details...
      </div>
    );
  }

  if (error && !selectedUser) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded text-sm max-w-md">
        {error}
        <div className="mt-2">
          <Link to="/users" className="text-indigo-600 hover:underline font-semibold">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">View User Details</h1>
        <p className="text-slate-500 text-sm">Detailed system metrics for employee profile.</p>
      </div>

      {selectedUser && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm max-w-lg space-y-4">
          <h2 className="text-lg font-bold text-slate-700 pb-2 border-b border-slate-100">
            Employee #{selectedUser.id} Profile
          </h2>
          
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Full Name</span>
              <span className="text-sm text-slate-700 font-medium">{selectedUser.name}</span>
            </div>
            
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Email Address</span>
              <span className="text-sm text-slate-700 font-medium">{selectedUser.email}</span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Account Created</span>
              <span className="text-sm text-slate-700 font-medium">
                {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'N/A'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Last Profile Update</span>
              <span className="text-sm text-slate-700 font-medium">
                {selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <Link
              to={`/users/${selectedUser.id}/edit`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition"
            >
              Edit User Settings
            </Link>
            <Link
              to="/users"
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded text-sm font-medium transition"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
