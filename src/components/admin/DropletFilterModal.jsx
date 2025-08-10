import React, { useState, useEffect } from 'react';

const DropletFilterModal = ({ open, onClose, onApply, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    sizeSlug: currentFilters.sizeSlug || '',
    regionSlug: currentFilters.regionSlug || '',
    userId: currentFilters.userId || '',
    createdAtFrom: currentFilters.createdAtFrom || '',
    createdAtTo: currentFilters.createdAtTo || '',
    status: currentFilters.status || 'all'
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Common size slugs
  const sizeSlugs = [
    { value: 's-1vcpu-1gb', label: '1 vCPU, 1 GB RAM' },
    { value: 's-1vcpu-2gb', label: '1 vCPU, 2 GB RAM' },
    { value: 's-2vcpu-2gb', label: '2 vCPU, 2 GB RAM' },
    { value: 's-2vcpu-4gb', label: '2 vCPU, 4 GB RAM' },
    { value: 's-4vcpu-8gb', label: '4 vCPU, 8 GB RAM' },
    { value: 's-6vcpu-16gb', label: '6 vCPU, 16 GB RAM' },
    { value: 's-8vcpu-32gb', label: '8 vCPU, 32 GB RAM' },
    { value: 's-16vcpu-64gb', label: '16 vCPU, 64 GB RAM' },
    { value: 's-24vcpu-128gb', label: '24 vCPU, 128 GB RAM' },
    { value: 's-32vcpu-256gb', label: '32 vCPU, 256 GB RAM' }
  ];

  // Common region slugs
  const regionSlugs = [
    { value: 'nyc1', label: 'New York 1' },
    { value: 'nyc3', label: 'New York 3' },
    { value: 'ams2', label: 'Amsterdam 2' },
    { value: 'ams3', label: 'Amsterdam 3' },
    { value: 'sfo1', label: 'San Francisco 1' },
    { value: 'sfo2', label: 'San Francisco 2' },
    { value: 'sgp1', label: 'Singapore 1' },
    { value: 'lon1', label: 'London 1' },
    { value: 'fra1', label: 'Frankfurt 1' },
    { value: 'tor1', label: 'Toronto 1' },
    { value: 'blr1', label: 'Bangalore 1' }
  ];

  // Load users for the dropdown
  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    // Filter out empty values
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value && value !== 'all')
    );
    onApply(activeFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      sizeSlug: '',
      regionSlug: '',
      userId: '',
      createdAtFrom: '',
      createdAtTo: '',
      status: 'all'
    });
    onApply({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Filter Droplets</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Size Slug Filter */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Droplet Size
              </h4>
              <select
                value={filters.sizeSlug}
                onChange={(e) => handleInputChange('sizeSlug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sizes</option>
                {sizeSlugs.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Slug Filter */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Region
              </h4>
              <select
                value={filters.regionSlug}
                onChange={(e) => handleInputChange('regionSlug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Regions</option>
                {regionSlugs.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            {/* User Filter */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                User
              </h4>
              <select
                value={filters.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loadingUsers}
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              {loadingUsers && (
                <div className="text-xs text-gray-500">Loading users...</div>
              )}
            </div>

            {/* Status Filter */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </h4>
              <select
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="new">New</option>
                <option value="off">Off</option>
                <option value="archive">Archive</option>
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Created Date Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.createdAtFrom}
                  onChange={(e) => handleInputChange('createdAtFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.createdAtTo}
                  onChange={(e) => handleInputChange('createdAtTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropletFilterModal; 