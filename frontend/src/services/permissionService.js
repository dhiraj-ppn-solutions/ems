import { store } from '../store';
import {
  fetchPermissionsThunk,
  fetchPermissionThunk,
  createPermissionThunk,
  updatePermissionThunk,
  deletePermissionThunk,
} from '../store/permission/permissionThunk';
import { clearSelectedPermission, clearPermissionErrors } from '../store/permission/permissionSlice';

export const permissionService = {
  fetchPermissions: (params) => store.dispatch(fetchPermissionsThunk(params)),
  fetchPermission: (id) => store.dispatch(fetchPermissionThunk(id)),
  createPermission: (permissionData) => store.dispatch(createPermissionThunk(permissionData)),
  updatePermission: (id, permissionData) => store.dispatch(updatePermissionThunk({ id, permissionData })),
  deletePermission: (id) => store.dispatch(deletePermissionThunk(id)),
  clearSelected: () => store.dispatch(clearSelectedPermission()),
  clearErrors: () => store.dispatch(clearPermissionErrors()),
};

export default permissionService;
