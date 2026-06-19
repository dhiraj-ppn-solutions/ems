import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import roleService from '../../services/roleService';
import permissionService from '../../services/permissionService';
import RoleTable from '../../components/Role/RoleTable';
import AssignPermissionModal from '../../components/Role/AssignPermissionModal';

const RoleList = () => {
  const navigate = useNavigate();
  const { hasPermission, loading: authLoading } = useAuth();
  const { roles, loading } = useSelector((state) => state.role);
  const { permissions } = useSelector((state) => state.permission);

  if (!authLoading && !hasPermission('manage-roles')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Modal State
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [activeRoleName, setActiveRoleName] = useState('');
  const [activeRolePermissions, setActiveRolePermissions] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    roleService.fetchRoles();
    permissionService.fetchPermissions();
  }, []);

  const handleEdit = (id) => {
    navigate(`/roles/${id}/edit`);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the role "${name}"?`)) {
      await roleService.deleteRole(id);
    }
  };

  const handleAssignTrigger = (id, name, currentPermissions) => {
    setActiveRoleId(id);
    setActiveRoleName(name);
    setActiveRolePermissions(currentPermissions);
    setIsAssignOpen(true);
  };

  const handleAssignConfirm = async (selectedNames) => {
    if (activeRoleId) {
      setAssignLoading(true);
      try {
        await roleService.syncPermissions(activeRoleId, selectedNames);
        setIsAssignOpen(false);
      } catch (err) {
        console.error(err);
      } finally {
        setAssignLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Role Management</h1>
          <p className="text-slate-500 text-sm">Define user roles and control access levels.</p>
        </div>
        <Link
          to="/roles/create"
          className="inline-flex justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition text-center self-start sm:self-auto"
        >
          Create Role
        </Link>
      </div>

      {loading && roles.length === 0 ? (
        <div className="text-center py-10 text-slate-500 animate-pulse text-sm">
          Loading roles...
        </div>
      ) : (
        <RoleTable
          roles={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssignPermissions={handleAssignTrigger}
        />
      )}

      <AssignPermissionModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onConfirm={handleAssignConfirm}
        roleName={activeRoleName}
        assignedPermissions={activeRolePermissions}
        allPermissions={permissions}
        loading={assignLoading}
      />
    </div>
  );
};

export default RoleList;
