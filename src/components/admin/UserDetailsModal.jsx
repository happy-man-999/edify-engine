import React, { useState, useEffect } from 'react';

const UserDetailsModal = ({ open, user, onClose, onEdit }) => {
  const [userDroplets, setUserDroplets] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [loadingDroplets, setLoadingDroplets] = useState(false);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && user?._id) {
      fetchUserData();
    } else {
      // Reset data when modal closes
      setUserDroplets([]);
      setUserPurchases([]);
      setError(null);
    }
  }, [open, user?._id]);

  const fetchUserData = async () => {
    if (!user?._id) return;

    try {
      setLoadingDroplets(true);
      setLoadingPurchases(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch droplets and purchases in parallel
      const [dropletsResponse, purchasesResponse] = await Promise.all([
        fetch(`/api/admin/users/${user._id}/droplets`, { headers }),
        fetch(`/api/admin/users/${user._id}/purchases`, { headers })
      ]);

      if (dropletsResponse.ok) {
        const dropletsData = await dropletsResponse.json();
        setUserDroplets(dropletsData.droplets || []);
      } else {
        console.error('Failed to fetch user droplets');
      }

      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json();
        setUserPurchases(purchasesData.purchases || []);
      } else {
        console.error('Failed to fetch user purchases');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoadingDroplets(false);
      setLoadingPurchases(false);
    }
  };

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
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'contributor':
        return 'bg-purple-100 text-purple-800';
      case 'lead':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusBadgeColor = (isVerified) => {
    return isVerified 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getDropletStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'off':
        return 'bg-gray-100 text-gray-800';
      case 'archive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDropletClick = (dropletName) => {
    // Check if the name is a complete domain (contains a dot)
    let dropletUrl;
    if (dropletName.includes('.')) {
      // If it contains a dot, treat it as a complete domain
      dropletUrl = dropletName.startsWith('http') ? dropletName : `https://${dropletName}`;
    } else {
      // If no dot, treat it as a subdomain of edifyengine.com
      dropletUrl = `https://${dropletName}.edifyengine.com`;
    }
    window.open(dropletUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden animate-modalFadeIn">
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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

          {/* User's Droplets Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              User's Droplets ({userDroplets.length})
            </h4>
            
            {loadingDroplets ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading droplets...</span>
                </div>
              </div>
            ) : userDroplets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-server text-3xl mb-2"></i>
                <p className="text-sm">No droplets found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userDroplets.map((droplet) => (
                  <div key={droplet.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleDropletClick(droplet.name)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 flex items-center group"
                        title="Open droplet website"
                      >
                        {droplet.name}
                        <i className="fas fa-external-link-alt ml-1 text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-200"></i>
                      </button>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDropletStatusColor(droplet.status)}`}>
                        {droplet.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>IP: {droplet.ipAddress || 'Not assigned'}</div>
                      <div>{droplet.sizeSlug} • {droplet.regionSlug}</div>
                      <div>Created: {formatDate(droplet.createdAt)}</div>
                      {droplet.priceMonthly && (
                        <div>Cost: ${droplet.priceMonthly.toFixed(2)}/month</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Purchases Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Purchased Items ({userPurchases.length})
            </h4>
            
            {loadingPurchases ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading purchases...</span>
                </div>
              </div>
            ) : userPurchases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-shopping-cart text-3xl mb-2"></i>
                <p className="text-sm">No purchases found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPurchases.map((purchase) => (
                  <div key={purchase.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    {/* Item Image and Type Badge */}
                    <div className="relative mb-3">
                      {purchase.item?.image && (
                        <img 
                          src={purchase.item.image} 
                          alt={purchase.item.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          purchase.item?.type === '3d-object' ? 'bg-purple-100 text-purple-800' :
                          purchase.item?.type === 'app' ? 'bg-blue-100 text-blue-800' :
                          purchase.item?.type === 'bundle' ? 'bg-green-100 text-green-800' :
                          purchase.item?.type === 'template' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <i className={`fas ${
                            purchase.item?.type === '3d-object' ? 'fa-cube' :
                            purchase.item?.type === 'app' ? 'fa-mobile-alt' :
                            purchase.item?.type === 'bundle' ? 'fa-box' :
                            purchase.item?.type === 'template' ? 'fa-file-alt' :
                            'fa-file'
                          } mr-1`}></i>
                          {purchase.item?.type?.replace('-', ' ') || 'Item'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Item Details */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-900 line-clamp-2">{purchase.item?.title || 'Unknown Item'}</h5>
                      <p className="text-xs text-gray-500 line-clamp-2">{purchase.item?.description || 'No description available'}</p>
                      
                      {/* Purchase Info */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Purchased:</span>
                          <span className="text-xs font-medium text-gray-900">
                            ${purchase.amount} {purchase.currency && purchase.currency !== 'USD' && `(${purchase.currency})`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Method:</span>
                          <span className="text-xs text-gray-900">{purchase.paymentMethod === 'solana' ? 'Solana' : 'Stripe'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Date:</span>
                          <span className="text-xs text-gray-900">{formatDate(purchase.purchaseDate)}</span>
                        </div>
                        {purchase.purchaseType === 'cart-purchase' && (
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">Type:</span>
                            <span className="text-xs text-gray-900">Cart Purchase</span>
                          </div>
                        )}
                      </div>
                      
                      {/* File Size */}
                      {purchase.item?.fileSize && (
                        <div className="flex items-center text-xs text-gray-500">
                          <i className="fas fa-download mr-1"></i>
                          {purchase.item.fileSize}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

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