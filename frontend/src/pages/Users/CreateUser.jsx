import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createUserThunk } from '../../store/user/userThunk';
import { clearUserErrors } from '../../store/user/userSlice';
import UserForm from '../../components/User/UserForm';

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    dispatch(clearUserErrors());
  }, [dispatch]);

  const handleSubmit = async (userData) => {
    setSuccess('');
    const result = await dispatch(createUserThunk(userData));
    if (!result.error) {
      setSuccess('User created successfully!');
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create User</h1>
        <p className="text-slate-500 text-sm">Add a new employee to the system.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        {success && (
          <div className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded text-sm mb-4">
            {success}
          </div>
        )}

        <UserForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          isEdit={false}
        />
        
        <div className="mt-4">
          <Link to="/users" className="text-indigo-600 hover:underline text-sm font-medium">
            &larr; Back to Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
