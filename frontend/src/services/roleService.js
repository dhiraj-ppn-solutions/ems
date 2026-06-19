import { store } from '../store';
import {
  fetchRolesThunk,
  fetchRoleThunk,
  createRoleThunk,
  updateRoleThunk,
  deleteRoleThunk,
  syncRolePermissionsThunk,
} from '../store/role/roleThunk';
import { clearSelectedRole, clearRoleErrors } from '../store/role/roleSlice';

export const roleService = {
  fetchRoles: (params) => store.dispatch(fetchRolesThunk(params)),
  fetchRole: (id) => store.dispatch(fetchRoleThunk(id)),
  createRole: (roleData) => store.dispatch(createRoleThunk(roleData)),
  updateRole: (id, roleData) => store.dispatch(updateRoleThunk({ id, roleData })),
  deleteRole: (id) => store.dispatch(deleteRoleThunk(id)),
  syncPermissions: (id, permissions) => store.dispatch(syncRolePermissionsThunk({ id, permissions })),
  clearSelected: () => store.dispatch(clearSelectedRole()),
  clearErrors: () => store.dispatch(clearRoleErrors()),
};

export default roleService;
