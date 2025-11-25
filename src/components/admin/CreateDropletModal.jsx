import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/uiSlice';

const CreateDropletModal = ({ open, onClose, onCreateDroplet }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useDispatch();

  // Load users when modal opens
  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedUser('');
      setSearchTerm('');
      setUsers([]);
    }
  }, [open]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users?limit=1000', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        dispatch(showNotification('Failed to load users', 'error'));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      dispatch(showNotification('Error loading users', 'error'));
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  const handleCreateDroplet = async () => {
    if (!selectedUser) {
      dispatch(showNotification('Please select a user', 'warning'));
      return;
    }

    setIsCreating(true);
    try {
      await onCreateDroplet(selectedUser);
      onClose();
    } catch (error) {
      console.error('Error creating droplet:', error);
      dispatch(showNotification('Failed to create droplet', 'error'));
    } finally {
      setIsCreating(false);
    }
  };

  if (!open) return null;

  const selectedUserData = users.find(user => user._id === selectedUser);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4" style={{ borderBottomColor: 'oklch(0.25 0.05 285)', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Create New Droplet
            </h3>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: 'oklch(0.65 0.05 280)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.98 0.01 280)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="space-y-6">
            {/* User Search */}
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
                <i className="fas fa-search absolute right-3 top-3" style={{ color: 'oklch(0.65 0.05 280)' }}></i>
              </div>
            </div>

            {/* Selected User Display */}
            {selectedUserData && (
              <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.1)', borderColor: 'oklch(0.70 0.15 150 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-3" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
                  <div>
                    <h4 className="text-sm font-medium" style={{ color: 'oklch(0.70 0.15 150)' }}>
                      Selected User
                    </h4>
                    <p className="text-sm" style={{ color: 'oklch(0.70 0.15 150)' }}>
                      {selectedUserData.firstName} {selectedUserData.lastName} ({selectedUserData.email})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Users List */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Select User ({filteredUsers.length} users)
              </label>
              
              {loadingUsers ? (
                <div className="rounded-md p-4 text-center" style={{ borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
                    <span className="ml-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading users...</span>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-md p-4 text-center" style={{ borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid', color: 'oklch(0.65 0.05 280)' }}>
                  No users found
                </div>
              ) : (
                <div className="rounded-md max-h-64 overflow-y-auto" style={{ borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
                  {filteredUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserSelect(user._id)}
                      className="w-full px-4 py-3 text-left transition-colors last:border-b-0"
                      style={{
                        borderBottomColor: 'oklch(0.25 0.05 285)',
                        borderBottomWidth: filteredUsers.indexOf(user) < filteredUsers.length - 1 ? '1px' : '0',
                        borderBottomStyle: 'solid',
                        backgroundColor: selectedUser === user._id ? 'oklch(0.45 0.15 290 / 0.1)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedUser !== user._id) {
                          e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedUser !== user._id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>{user.email}</p>
                          <div className="flex items-center mt-1">
                            <span 
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              style={
                                user.role === 'admin' 
                                  ? { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' }
                                  : user.role === 'contributor'
                                  ? { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }
                                  : { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
                              }
                            >
                              {user.role}
                            </span>
                            <span 
                              className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              style={
                                user.isEmailVerified 
                                  ? { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
                                  : { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' }
                              }
                            >
                              {user.isEmailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                        </div>
                        {selectedUser === user._id && (
                          <i className="fas fa-check-circle" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end space-x-3" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'oklch(0.25 0.05 285)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateDroplet}
            disabled={!selectedUser || isCreating}
            className="px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            style={{
              backgroundColor: 'oklch(0.70 0.15 150)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled && selectedUser) {
                e.currentTarget.style.backgroundColor = 'oklch(0.75 0.15 150)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.70 0.15 150)';
              }
            }}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: 'oklch(0.98 0.01 280)' }}></div>
                Creating...
              </>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i>
                Create Droplet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDropletModal;
