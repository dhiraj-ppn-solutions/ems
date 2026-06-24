import { store } from '../store';
import {
  fetchUsersThunk,
  fetchUserThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
  assignUserRoleThunk,
} from '../store/user/userThunk';
import { clearSelectedUser, clearUserErrors } from '../store/user/userSlice';

export const userService = {
  fetchUsers: (params) => store.dispatch(fetchUsersThunk(params)),
  fetchUser: (id) => store.dispatch(fetchUserThunk(id)),
  createUser: (userData) => store.dispatch(createUserThunk(userData)),
  updateUser: (id, userData) => store.dispatch(updateUserThunk({ id, userData })),
  deleteUser: (id) => store.dispatch(deleteUserThunk(id)),
  assignRole: (id, role) => store.dispatch(assignUserRoleThunk({ id, role })),
  clearSelected: () => store.dispatch(clearSelectedUser()),
  clearErrors: () => store.dispatch(clearUserErrors()),
};

export default userService;
