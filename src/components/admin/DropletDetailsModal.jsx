import React from 'react';
import { shortAddress } from '../../utils/format';

const DropletDetailsModal = ({ open, droplet, onClose, onEdit }) => {
  if (!open || !droplet) return null;

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
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
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fas fa-server text-blue-600 text-2xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {droplet.name}
              </h3>
              <p className="text-gray-600">Droplet ID: {droplet.id}</p>
            </div>
          </div>

          {/* Droplet Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Basic Information
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Droplet Name</label>
                  <p className="text-sm text-gray-900 font-mono">{droplet.name}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Droplet ID</label>
                  <p className="text-sm text-gray-900 font-mono">{droplet.id}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(droplet.status)}`}>
                    {droplet.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">IP Address</label>
                  <p className="text-sm text-gray-900 font-mono">
                    {droplet.ipAddress || 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Specifications
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Size</label>
                  <p className="text-sm text-gray-900">{droplet.sizeSlug}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Region</label>
                  <p className="text-sm text-gray-900">{droplet.regionSlug}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">vCPUs</label>
                  <p className="text-sm text-gray-900">{droplet.vcpus || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Memory</label>
                  <p className="text-sm text-gray-900">{formatMemory(droplet.memory)}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500">Disk</label>
                  <p className="text-sm text-gray-900">{formatDisk(droplet.disk)}</p>
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
                <label className="block text-xs font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900">{formatDate(droplet.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500">Monthly Cost</label>
                <p className="text-sm text-gray-900">
                  ${droplet.priceMonthly ? droplet.priceMonthly.toFixed(2) : '0.00'}
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500">Linked User</label>
                <p className="text-sm text-gray-900 font-mono">{droplet.user}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500">Transaction</label>
                <p className="text-sm text-gray-900 font-mono">
                  {droplet.transaction ? shortAddress(droplet.transaction) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {droplet.tags && droplet.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {droplet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
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
            {onEdit && (
              <button
                onClick={() => onEdit(droplet)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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