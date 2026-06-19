import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import roleService from '../../services/roleService';
import RoleForm from '../../components/Role/RoleForm';

const CreateRole = () => {
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.role);

  useEffect(() => {
    roleService.clearErrors();
  }, []);

  const handleSubmit = async (roleData) => {
    const result = await roleService.createRole(roleData);
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
        <h1 className="text-2xl font-bold text-slate-800">Create New Role</h1>
        <p className="text-slate-500 text-sm">Add a new role to assign permissions to users.</p>
      </div>

      <RoleForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        serverErrors={error}
      />
    </div>
  );
};

export default CreateRole;
