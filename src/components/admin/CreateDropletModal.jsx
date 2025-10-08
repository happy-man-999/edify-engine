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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Droplet
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
                <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>
            </div>

            {/* Selected User Display */}
            {selectedUserData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-green-600 mr-3"></i>
                  <div>
                    <h4 className="text-sm font-medium text-green-900">
                      Selected User
                    </h4>
                    <p className="text-sm text-green-700">
                      {selectedUserData.firstName} {selectedUserData.lastName} ({selectedUserData.email})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Users List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User ({filteredUsers.length} users)
              </label>
              
              {loadingUsers ? (
                <div className="border border-gray-300 rounded-md p-4 text-center">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading users...</span>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="border border-gray-300 rounded-md p-4 text-center text-gray-500">
                  No users found
                </div>
              ) : (
                <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserSelect(user._id)}
                      className={`w-full px-4 py-3 text-left border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        selectedUser === user._id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : user.role === 'contributor'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.isEmailVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.isEmailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                        </div>
                        {selectedUser === user._id && (
                          <i className="fas fa-check-circle text-blue-600"></i>
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
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateDroplet}
            disabled={!selectedUser || isCreating}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
