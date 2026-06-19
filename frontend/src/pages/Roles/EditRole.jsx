import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import roleService from '../../services/roleService';
import RoleForm from '../../components/Role/RoleForm';

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedRole, loading, error } = useSelector((state) => state.role);

  useEffect(() => {
    roleService.clearErrors();
    roleService.fetchRole(id);
    return () => {
      roleService.clearSelected();
    };
  }, [id]);

  const handleSubmit = async (roleData) => {
    const result = await roleService.updateRole(id, roleData);
    if (!result.error) {
      navigate('/roles');
    }
  };

  const handleCancel = () => {
    navigate('/roles');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Role</h1>
        <p className="text-slate-500 text-sm">Update the properties of an existing user role.</p>
      </div>

      {loading && !selectedRole ? (
        <div className="text-sm text-slate-500 animate-pulse">Loading role details...</div>
      ) : (
        <RoleForm
          initialData={selectedRole}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          serverErrors={error}
        />
      )}
    </div>
  );
};

export default EditRole;
