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
      showError(error || 'Failed to update user role');
    }
  };

  // Handle contributor status update
  const handleContributorToggle = async (userId, isContributor) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/contributor`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isContributor })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update contributor status');
      }

      dispatch(showNotification('Contributor status updated successfully'));
      fetchUsersWithParams();
    } catch (error) {
      showError(error || 'Failed to update contributor status');
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
          <h2 className="text-xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>User Management</h2>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Manage all registered users and their accounts</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => fetchUsersWithParams()}
            disabled={loading}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'oklch(0.45 0.15 290)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
              }
            }}
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'animate-spin' : ''}`}></i>
            Refresh
          </button>
          <button 
            onClick={handleAddUser}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.70 0.15 150)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.75 0.15 150)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.70 0.15 150)';
            }}
          >
            <i className="fas fa-plus mr-2"></i>
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div 
        className="rounded-lg shadow p-6"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Search Users
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  borderColor: 'oklch(0.25 0.05 285)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'oklch(0.98 0.01 280)',
                  '--tw-ring-color': 'oklch(0.45 0.15 290)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
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
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'oklch(0.12 0.02 280)',
                borderColor: 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'oklch(0.98 0.01 280)',
                '--tw-ring-color': 'oklch(0.45 0.15 290)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="all">All Roles</option>
              <option value="lead">Lead</option>
              <option value="user">User</option>
              <option value="contributor">Contributor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'oklch(0.12 0.02 280)',
                borderColor: 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'oklch(0.98 0.01 280)',
                '--tw-ring-color': 'oklch(0.45 0.15 290)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Sort By
            </label>
            <select
              value={`${sort.field}-${sort.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'oklch(0.12 0.02 280)',
                borderColor: 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'oklch(0.98 0.01 280)',
                '--tw-ring-color': 'oklch(0.45 0.15 290)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="createdAt-desc">Sign-up Date (Newest)</option>
              <option value="createdAt-asc">Sign-up Date (Oldest)</option>
              <option value="lastLogin-desc">Last Login (Newest)</option>
              <option value="lastLogin-asc">Last Login (Oldest)</option>
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
      <div 
        className="rounded-lg shadow overflow-hidden relative"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
          <h3 className="text-lg font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
            Users ({pagination.total || users.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
              <span className="ml-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
            <i className="fas fa-users text-4xl mb-4"></i>
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                <tr style={{ borderBottom: '1px solid oklch(0.25 0.05 285)' }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Sign-up Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Email Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr 
                    key={user._id}
                    style={{ 
                      backgroundColor: 'oklch(0.18 0.05 285)',
                      borderBottom: '1px solid oklch(0.25 0.05 285)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
                  >
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
                            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.25 0.05 285)' }}>
                              <span className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                                {user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                            {user.firstName} {user.lastName}
                            {user.role === 'admin' && (
                              <span className="ml-2 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' }}>
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {/* Display role */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={
                              user.role === 'admin'
                                ? { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' }
                                : user.role === 'lead'
                                ? { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }
                                : { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }
                            }
                          >
                            {user.role}
                          </span>
                          {user.isContributor && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' }}>
                              Contributor
                            </span>
                          )}
                        </div>
                        {/* Role management buttons */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleRoleUpdate(user._id, 'admin')}
                              disabled={currentUser?._id === user._id}
                              className="text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ color: 'oklch(0.65 0.05 280)' }}
                              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = 'oklch(0.98 0.01 280)'; }}
                              onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = 'oklch(0.65 0.05 280)'; }}
                            >
                              Make Admin
                            </button>
                          )}
                          {user.role === 'admin' && currentUser?._id !== user._id && (
                            <button
                              onClick={() => handleRoleUpdate(user._id, 'user')}
                              className="text-xs"
                              style={{ color: 'oklch(0.55 0.22 25)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.60 0.22 25)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.22 25)'; }}
                            >
                              Remove Admin
                            </button>
                          )}
                          {!user.isContributor && (
                            <button
                              onClick={() => handleContributorToggle(user._id, true)}
                              className="text-xs"
                              style={{ color: 'oklch(0.50 0.18 260)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.18 260)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                            >
                              +Contributor
                            </button>
                          )}
                          {user.isContributor && (
                            <button
                              onClick={() => handleContributorToggle(user._id, false)}
                              className="text-xs"
                              style={{ color: 'oklch(0.55 0.22 25)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.60 0.22 25)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.22 25)'; }}
                            >
                              -Contributor
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={
                          user.isEmailVerified 
                            ? { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
                            : { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }
                        }
                      >
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewUserDetails(user)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.45 0.15 290)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.45 0.15 290)'; }}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.70 0.15 150)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                          title="Edit User"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={currentUser?._id === user._id}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.55 0.22 25)' }}
                          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = 'oklch(0.60 0.22 25)'; }}
                          onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.color = 'oklch(0.55 0.22 25)'; }}
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

        <div className="px-6 py-4 flex items-center justify-between border-t sm:px-6" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                }
              }}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                }
              }}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                <label htmlFor="page-size" className="mr-2 text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  Show
                </label>
                <select
                  id="page-size"
                  value={pagination.limit}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                  style={{
                    backgroundColor: 'oklch(0.12 0.02 280)',
                    borderColor: 'oklch(0.25 0.05 285)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: 'oklch(0.98 0.01 280)',
                    '--tw-ring-color': 'oklch(0.45 0.15 290)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="ml-2 text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  per page
                </span>
              </div>
              <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-2 py-2 border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'oklch(0.18 0.05 285)',
                  borderColor: 'oklch(0.25 0.05 285)',
                  color: 'oklch(0.65 0.05 280)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                    e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                    e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                  }
                }}
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
                    className="relative inline-flex items-center px-3 py-2 border text-sm font-medium"
                    style={
                      page === pagination.page
                        ? {
                            zIndex: 10,
                            backgroundColor: 'oklch(0.45 0.15 290 / 0.2)',
                            borderColor: 'oklch(0.45 0.15 290)',
                            color: 'oklch(0.45 0.15 290)'
                          }
                        : page === '...'
                        ? {
                            borderColor: 'oklch(0.25 0.05 285)',
                            backgroundColor: 'oklch(0.18 0.05 285)',
                            color: 'oklch(0.65 0.05 280)',
                            cursor: 'default'
                          }
                        : {
                            backgroundColor: 'oklch(0.18 0.05 285)',
                            borderColor: 'oklch(0.25 0.05 285)',
                            color: 'oklch(0.65 0.05 280)'
                          }
                    }
                    onMouseEnter={(e) => {
                      if (page !== '...' && page !== pagination.page) {
                        e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                        e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== '...' && page !== pagination.page) {
                        e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                        e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="relative inline-flex items-center px-2 py-2 border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'oklch(0.18 0.05 285)',
                  borderColor: 'oklch(0.25 0.05 285)',
                  color: 'oklch(0.65 0.05 280)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                    e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                    e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                  }
                }}
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