import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchUserThunk, updateUserThunk } from '../../store/user/userThunk';
import { clearSelectedUser, clearUserErrors } from '../../store/user/userSlice';
import UserForm from '../../components/User/UserForm';

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, loading, error } = useSelector((state) => state.user);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchUserThunk(id));

    return () => {
      dispatch(clearSelectedUser());
      dispatch(clearUserErrors());
    };
  }, [dispatch, id]);

  const handleSubmit = async (userData) => {
    setSuccess('');
    const result = await dispatch(updateUserThunk({ id, userData }));
    if (!result.error) {
      setSuccess('User updated successfully!');
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    }
  };

  if (loading && !selectedUser) {
    return (
      <div className="text-center py-10 text-slate-500 animate-pulse text-sm">
        Loading user profile details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit User</h1>
        <p className="text-slate-500 text-sm">Update profile settings for employee #{id}</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        {success && (
          <div className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded text-sm mb-4">
            {success}
          </div>
        )}

        {selectedUser && (
          <UserForm
            initialData={selectedUser}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            isEdit={true}
          />
        )}

        <div className="mt-4">
          <Link to="/users" className="text-indigo-600 hover:underline text-sm font-medium">
            &larr; Back to Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
