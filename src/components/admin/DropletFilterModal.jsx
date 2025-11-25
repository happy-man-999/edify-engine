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
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Droplet Size
              </h4>
              <select
                value={filters.sizeSlug}
                onChange={(e) => handleInputChange('sizeSlug', e.target.value)}
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
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Region
              </h4>
              <select
                value={filters.regionSlug}
                onChange={(e) => handleInputChange('regionSlug', e.target.value)}
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
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                User
              </h4>
              <select
                value={filters.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
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
                <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading users...</div>
              )}
            </div>

            {/* Status Filter */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Status
              </h4>
              <select
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="new">New</option>
                <option value="off">Off</option>
                <option value="archive">Archive</option>
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mt-6 pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>
              Created Date Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.createdAtFrom}
                  onChange={(e) => handleInputChange('createdAtFrom', e.target.value)}
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
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.createdAtTo}
                  onChange={(e) => handleInputChange('createdAtTo', e.target.value)}
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
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 flex justify-end space-x-3" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-lg transition-colors"
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
              Clear All
            </button>
            <button
              onClick={handleApply}
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
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropletFilterModal; 