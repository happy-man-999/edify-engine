import React from 'react';
import { shortAddress } from '../../utils/format';

const DropletDetailsModal = ({ open, droplet, onClose, onEdit }) => {
  if (!open || !droplet) return null;

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

  const getStatusBadgeColor = (status) => {
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

  const formatMemory = (memory) => {
    if (!memory) return 'N/A';
    return memory >= 1024 ? `${(memory / 1024).toFixed(1)} GB` : `${memory} MB`;
  };

  const formatDisk = (disk) => {
    if (!disk) return 'N/A';
    return disk >= 1024 ? `${(disk / 1024).toFixed(1)} TB` : `${disk} GB`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div 
        className="rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-modalFadeIn"
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
            <h2 className="text-xl font-bold">Droplet Details</h2>
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
          {/* Droplet Basic Info */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16">
              <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)' }}>
                <i className="fas fa-server text-2xl" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <button
                onClick={() => handleDropletClick(droplet.name)}
                className="text-lg font-semibold hover:underline transition-colors duration-200 flex items-center group"
                style={{ color: 'oklch(0.45 0.15 290)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
                title="Open droplet website"
              >
                {droplet.name}
                <i className="fas fa-external-link-alt ml-2 text-sm opacity-60 group-hover:opacity-100 transition-opacity duration-200"></i>
              </button>
              <p style={{ color: 'oklch(0.65 0.05 280)' }}>Droplet ID: {droplet.id}</p>
            </div>
          </div>

          {/* Droplet Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Basic Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Droplet Name</label>
                  <button
                    onClick={() => handleDropletClick(droplet.name)}
                    className="text-sm hover:underline transition-colors duration-200 flex items-center group font-mono"
                    style={{ color: 'oklch(0.45 0.15 290)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
                    title="Open droplet website"
                  >
                    {droplet.name}
                    <i className="fas fa-external-link-alt ml-1 text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-200"></i>
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Droplet ID</label>
                  <p className="text-sm font-mono" style={{ color: 'oklch(0.98 0.01 280)' }}>{droplet.id}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getStatusBadgeColor(droplet.status)}>
                    {droplet.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>IP Address</label>
                  <p className="text-sm font-mono" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {droplet.ipAddress || 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Specifications
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Size</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{droplet.sizeSlug}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Region</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{droplet.regionSlug}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>vCPUs</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{droplet.vcpus || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Memory</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatMemory(droplet.memory)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Disk</label>
                  <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatDisk(droplet.disk)}</p>
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
                <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Created At</label>
                <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatDate(droplet.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Monthly Cost</label>
                <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  ${droplet.priceMonthly ? droplet.priceMonthly.toFixed(2) : '0.00'}
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Linked User</label>
                <p className="text-sm font-mono" style={{ color: 'oklch(0.98 0.01 280)' }}>{droplet.user}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Transaction</label>
                <p className="text-sm font-mono" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  {droplet.transaction ? shortAddress(droplet.transaction) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {droplet.tags && droplet.tags.length > 0 && (
            <div className="mt-6 pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {droplet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}
                  >
                    {tag}
                  </span>
                ))}
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
            {onEdit && (
              <button
                onClick={() => onEdit(droplet)}
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
                Edit Droplet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropletDetailsModal; 