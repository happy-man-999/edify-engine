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
        return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      case 'contributor':
        return { backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' };
      case 'lead':
        return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      default:
        return { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' };
    }
  };

  const getStatusBadgeColor = (isVerified) => {
    return isVerified 
      ? { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
      : { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
  };

  const getDropletStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' };
      case 'new':
        return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      case 'off':
        return { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' };
      case 'archive':
        return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      default:
        return { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' };
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
      <div 
        className="rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden animate-modalFadeIn"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Header */}
        <div 
          className="p-6"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
        >
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
                <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.25 0.05 285)' }}>
                  <span className="text-xl font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {user.firstName} {user.lastName}
              </h3>
              <p style={{ color: 'oklch(0.65 0.05 280)' }}>{user.email}</p>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Account Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Full Name</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{user.firstName} {user.lastName}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Email Address</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{user.email}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Role</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Email Verification</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getStatusBadgeColor(user.isEmailVerified)}>
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Activity */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Account Activity
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Account Created</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatDate(user.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Last Updated</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatDate(user.updatedAt)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Last Login</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never logged in'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Authentication Method</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {user.googleId ? 'Google OAuth' : 'Email/Password'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>
              Additional Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>User ID</label>
                <p className="text-sm font-mono" style={{ color: 'oklch(0.98 0.01 280)' }}>{user._id}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Account Status</label>
                <p className="text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }}>
                    Active
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* User's Droplets Section */}
          <div className="mt-6 pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>
              User's Droplets ({userDroplets.length})
            </h4>
            
            {loadingDroplets ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
                  <span className="ml-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading droplets...</span>
                </div>
              </div>
            ) : userDroplets.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'oklch(0.65 0.05 280)' }}>
                <i className="fas fa-server text-3xl mb-2"></i>
                <p className="text-sm">No droplets found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userDroplets.map((droplet) => (
                  <div key={droplet.id} className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.12 0.02 280)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleDropletClick(droplet.name)}
                        className="text-sm font-medium hover:underline transition-colors duration-200 flex items-center group"
                        style={{ color: 'oklch(0.45 0.15 290)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
                        title="Open droplet website"
                      >
                        {droplet.name}
                        <i className="fas fa-external-link-alt ml-1 text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-200"></i>
                      </button>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={getDropletStatusColor(droplet.status)}>
                        {droplet.status}
                      </span>
                    </div>
                    <div className="text-xs space-y-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
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
          <div className="mt-6 pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>
              Purchased Items ({userPurchases.length})
            </h4>
            
            {loadingPurchases ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
                  <span className="ml-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading purchases...</span>
                </div>
              </div>
            ) : userPurchases.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'oklch(0.65 0.05 280)' }}>
                <i className="fas fa-shopping-cart text-3xl mb-2"></i>
                <p className="text-sm">No purchases found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPurchases.map((purchase) => (
                  <div 
                    key={purchase.id} 
                    className="rounded-lg p-4 transition-shadow"
                    style={{ 
                      backgroundColor: 'oklch(0.18 0.05 285)', 
                      borderColor: 'oklch(0.25 0.05 285)', 
                      borderWidth: '1px', 
                      borderStyle: 'solid'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
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
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={
                            purchase.item?.type === '3d-object' 
                              ? { backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' }
                              : purchase.item?.type === 'app'
                              ? { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }
                              : purchase.item?.type === 'bundle'
                              ? { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
                              : purchase.item?.type === 'template'
                              ? { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }
                              : { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' }
                          }
                        >
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
                      <h5 className="text-sm font-medium line-clamp-2" style={{ color: 'oklch(0.98 0.01 280)' }}>{purchase.item?.title || 'Unknown Item'}</h5>
                      <p className="text-xs line-clamp-2" style={{ color: 'oklch(0.65 0.05 280)' }}>{purchase.item?.description || 'No description available'}</p>
                      
                      {/* Purchase Info */}
                      <div className="pt-2" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>Purchased:</span>
                          <span className="text-xs font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                            ${purchase.amount} {purchase.currency && purchase.currency !== 'USD' && `(${purchase.currency})`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>Method:</span>
                          <span className="text-xs" style={{ color: 'oklch(0.98 0.01 280)' }}>{purchase.paymentMethod === 'solana' ? 'Solana' : 'Stripe'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>Date:</span>
                          <span className="text-xs" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatDate(purchase.purchaseDate)}</span>
                        </div>
                        {purchase.purchaseType === 'cart-purchase' && (
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>Type:</span>
                            <span className="text-xs" style={{ color: 'oklch(0.98 0.01 280)' }}>Cart Purchase</span>
                          </div>
                        )}
                      </div>
                      
                      {/* File Size */}
                      {purchase.item?.fileSize && (
                        <div className="flex items-center text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>
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
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.1)', borderColor: 'oklch(0.55 0.22 25 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle mr-2" style={{ color: 'oklch(0.55 0.22 25)' }}></i>
                <p className="text-sm" style={{ color: 'oklch(0.55 0.22 25)' }}>{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-6 flex justify-end space-x-3" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
              }}
            >
              Close
            </button>
            <button
              onClick={() => onEdit && onEdit(user)}
              className="px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'oklch(0.45 0.15 290)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
              }}
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