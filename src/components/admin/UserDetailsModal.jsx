import React from 'react';

const UserDetailsModal = ({ open, user, onClose, onEdit }) => {
  if (!open || !user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getStatusBadgeColor = (isVerified) => {
    return isVerified 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">User Details</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-700">
                    {user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Account Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Full Name</label>
                  <p className="text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Email Address</label>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Role</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Email Verification</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.isEmailVerified)}`}>
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Activity */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Account Activity
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Account Created</label>
                  <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Last Login</label>
                  <p className="text-sm text-gray-900">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never logged in'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Authentication Method</label>
                  <p className="text-sm text-gray-900">
                    {user.googleId ? 'Google OAuth' : 'Email/Password'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Additional Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">User ID</label>
                <p className="text-sm text-gray-900 font-mono">{user._id}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500">Account Status</label>
                <p className="text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit && onEdit(user)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-edit mr-2"></i>
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal; 