import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import permissionService from '../../services/permissionService';
import PermissionTable from '../../components/Permission/PermissionTable';

const PermissionList = () => {
  const navigate = useNavigate();
  const { hasPermission, loading: authLoading } = useAuth();
  const { permissions, loading } = useSelector((state) => state.permission);

  const hasManagePermissions = hasPermission('manage-permissions');

  useEffect(() => {
    if (!authLoading && hasManagePermissions) {
      permissionService.fetchPermissions();
    }
  }, [authLoading, hasManagePermissions]);

  if (!authLoading && !hasManagePermissions) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEdit = (id) => {
    navigate(`/permissions/${id}/edit`);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the permission "${name}"?`)) {
      await permissionService.deletePermission(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Permission Management</h1>
          <p className="text-slate-500 text-sm">Create and modify system-wide action permissions.</p>
        </div>
        <Link
          to="/permissions/create"
          className="inline-flex justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition text-center self-start sm:self-auto"
        >
          Create Permission
        </Link>
      </div>

      {loading && permissions.length === 0 ? (
        <div className="text-center py-10 text-slate-500 animate-pulse text-sm">
          Loading permissions...
        </div>
      ) : (
        <PermissionTable
          permissions={permissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PermissionList;
