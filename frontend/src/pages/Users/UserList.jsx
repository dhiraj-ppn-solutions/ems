import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchUsersThunk, deleteUserThunk } from '../../store/user/userThunk';
import UserTable from '../../components/User/UserTable';
import UserSearch from '../../components/User/UserSearch';
import UserPagination from '../../components/User/UserPagination';
import UserDeleteModal from '../../components/User/UserDeleteModal';

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, pagination } = useSelector((state) => state.user);

  // Filter and pagination states
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  // Fetch users when parameters change
  useEffect(() => {
    dispatch(fetchUsersThunk({ search, sort_by: sortBy, sort_order: sortOrder, page }));
  }, [dispatch, search, sortBy, sortOrder, page]);

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1); // Reset to page 1 on new search
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // View, Edit, and Delete action handlers
  const handleView = (id) => {
    navigate(`/users/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/users/${id}/edit`);
  };

  const handleDeleteTrigger = (id, name) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await dispatch(deleteUserThunk(deleteTargetId));
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetName('');
      // Re-fetch users to verify pagination details recalculate
      dispatch(fetchUsersThunk({ search, sort_by: sortBy, sort_order: sortOrder, page }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm">Manage and monitor employee accounts.</p>
        </div>
        <Link
          to="/users/create"
          className="inline-flex justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition text-center self-start sm:self-auto"
        >
          Create User
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <UserSearch onSearch={handleSearch} />
      </div>

      {loading && users.length === 0 ? (
        <div className="text-center py-10 text-slate-500 animate-pulse text-sm">
          Loading users directory...
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteTrigger}
          />

          <UserPagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <UserDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        userName={deleteTargetName}
      />
    </div>
  );
};

export default UserList;
