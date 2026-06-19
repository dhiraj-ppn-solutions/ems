import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import permissionService from '../../services/permissionService';
import PermissionForm from '../../components/Permission/PermissionForm';

const CreatePermission = () => {
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.permission);

  useEffect(() => {
    permissionService.clearErrors();
  }, []);

  const handleSubmit = async (permissionData) => {
    const result = await permissionService.createPermission(permissionData);
    if (!result.error) {
      navigate('/permissions');
    }
  };

  const handleCancel = () => {
    navigate('/permissions');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create New Permission</h1>
        <p className="text-slate-500 text-sm">Add a new action capability that can be assigned to roles.</p>
      </div>

      <PermissionForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        serverErrors={error}
      />
    </div>
  );
};

export default CreatePermission;
