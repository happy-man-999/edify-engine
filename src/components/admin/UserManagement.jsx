import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  updateUserRole, 
  deleteUser, 
  updateUser,
  createUser,
  setFilters, 
  setSort,
  setPagination,
  clearError 
} from '../../store/userManagementSlice';
import { showNotification } from '../../store/uiSlice';
import { useYesNoModal } from '../../hooks/useYesNoModal';
import { useErrorModal } from '../../hooks/useErrorModal';
import UserDetailsModal from './UserDetailsModal';
import UserEditModal from './UserEditModal';
import AddUserModal from './AddUserModal';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { 
    users, 
    loading, 
    error, 
    filters, 
    sort,
    pagination 
  } = useSelector(state => state.userManagement);
  const { user: currentUser } = useSelector(state => state.auth);
  const { showModal } = useYesNoModal();
  const { showError } = useErrorModal();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users with current filters and pagination
  const fetchUsersWithParams = useCallback(() => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search: debouncedSearchTerm,
      role: filterRole !== 'all' ? filterRole : '',
      status: filters.status !== 'all' ? filters.status : '',
      sortBy: sort.field,
      sortOrder: sort.order
    };
    dispatch(fetchUsers(params));
  }, [dispatch, pagination.page, pagination.limit, debouncedSearchTerm, filterRole, filters.status, sort.field, sort.order]);

  // Fetch users on component mount and when dependencies change
  useEffect(() => {
    fetchUsersWithParams();
  }, [fetchUsersWithParams]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearError());
    }
  }, [error, dispatch, showError]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      dispatch(showNotification('User role updated successfully'));
      // Refetch users to get updated data
      fetchUsersWithParams();
    } catch (error) {
      showError(error || 'Failed to update user role' );
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    const confirmed = await showModal('Are you sure you want to delete this user? This action cannot be undone.');
    
    if (confirmed) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        dispatch(showNotification('User deleted successfully'));
        // Refetch users to get updated data
        fetchUsersWithParams();
      } catch (error) {
        showError(error || 'Failed to delete user');
      }
    }
  };

  // Handle user details modal
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  const handleCloseUserDetailsModal = () => {
    setIsUserDetailsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle user edit modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserEditModalOpen(true);
  };

  const handleCloseUserEditModal = () => {
    setIsUserEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userId, userData) => {
    try {
      await dispatch(updateUser({ userId, userData })).unwrap();
      dispatch(showNotification('User updated successfully'));
      // Refetch users to get updated data
      fetchUsersWithParams();
    } catch (error) {
      showError(error || 'Failed to update user');
    }
  };

  // Handle add user modal
  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleCreateUser = async (userData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      dispatch(showNotification('User created successfully'));
      // Refetch users to get updated data
      fetchUsersWithParams();
    } catch (error) {
      showError(error || 'Failed to create user');
    }
  };

  // Handle sort change
  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    dispatch(setSort({ field, order }));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    dispatch(setPagination({ page: 1, limit: newPageSize }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }));
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const totalPagesCount = pagination.pages;
    const currentPageNumber = pagination.page;
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    const start = Math.max(2, currentPageNumber - 2);
    const end = Math.min(totalPagesCount - 1, currentPageNumber + 2);
    
    if (start > 2) {
      pages.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPagesCount - 1) {
      pages.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPagesCount > 1) {
      pages.push(totalPagesCount);
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600">Manage all registered users and their accounts</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => fetchUsersWithParams()}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'animate-spin' : ''}`}></i>
            Refresh
          </button>
          <button 
            onClick={handleAddUser}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="lead">Lead</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={`${sort.field}-${sort.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Sign-up Date (Newest)</option>
              <option value="createdAt-asc">Sign-up Date (Oldest)</option>
              <option value="firstName-asc">First Name (A-Z)</option>
              <option value="firstName-desc">First Name (Z-A)</option>
              <option value="lastName-asc">Last Name (A-Z)</option>
              <option value="lastName-desc">Last Name (Z-A)</option>
              <option value="email-asc">Email (A-Z)</option>
              <option value="email-desc">Email (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden relative">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({pagination.total || users.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <i className="fas fa-users text-4xl mb-4"></i>
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sign-up Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                            {user.role === 'admin' && (
                              <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'lead'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleRoleUpdate(user._id, 'user')}
                          disabled={currentUser?._id === user._id}
                          className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {currentUser?._id === user._id ? 'Cannot change own role' : 'Make User'}
                        </button>
                      )}
                      {user.role === 'user' && (
                        <button
                          onClick={() => handleRoleUpdate(user._id, 'admin')}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isEmailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewUserDetails(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit User"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={currentUser?._id === user._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={currentUser?._id === user._id ? 'Cannot delete own account' : 'Delete User'}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <label htmlFor="page-size" className="mr-2 text-sm font-medium text-gray-700">
                  Show
                </label>
                <select
                  id="page-size"
                  value={pagination.limit}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  per page
                </span>
              </div>
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {generatePageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                    disabled={page === '...'}
                    className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                      page === pagination.page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : page === '...'
                        ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        open={isUserDetailsModalOpen}
        user={selectedUser}
        onClose={handleCloseUserDetailsModal}
        onEdit={handleEditUser}
      />

      {/* User Edit Modal */}
      <UserEditModal
        open={isUserEditModalOpen}
        user={selectedUser}
        onClose={handleCloseUserEditModal}
        onSave={handleSaveUser}
      />

      {/* Add User Modal */}
      <AddUserModal
        open={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onSave={handleCreateUser}
      />
    </div>
  );
};

export default UserManagement; 