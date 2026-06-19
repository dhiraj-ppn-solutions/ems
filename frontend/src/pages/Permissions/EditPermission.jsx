import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import permissionService from '../../services/permissionService';
import PermissionForm from '../../components/Permission/PermissionForm';

const EditPermission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPermission, loading, error } = useSelector((state) => state.permission);

  useEffect(() => {
    permissionService.clearErrors();
    permissionService.fetchPermission(id);
    return () => {
      permissionService.clearSelected();
    };
  }, [id]);

  const handleSubmit = async (permissionData) => {
    const result = await permissionService.updatePermission(id, permissionData);
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
        <h1 className="text-2xl font-bold text-slate-800">Edit Permission</h1>
        <p className="text-slate-500 text-sm">Update the properties of an existing system permission.</p>
      </div>

      {loading && !selectedPermission ? (
        <div className="text-sm text-slate-500 animate-pulse">Loading permission details...</div>
      ) : (
        <PermissionForm
          initialData={selectedPermission}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          serverErrors={error}
        />
      )}
    </div>
  );
};

export default EditPermission;
