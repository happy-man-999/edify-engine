import React, { useState, useEffect, useCallback } from 'react';
import { useDroplets } from '../../hooks/useDroplets';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/uiSlice';
import LoadingSpinner from '../LoadingSpinner';
import { shortAddress } from '../../utils/format';
import DropletDetailsModal from './DropletDetailsModal';
import DropletFilterModal from './DropletFilterModal';
import CreateDropletModal from './CreateDropletModal';
import { useYesNoModal } from '../../hooks/useYesNoModal';

const DropletManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedDroplet, setSelectedDroplet] = useState(null);
  const [isDropletDetailsModalOpen, setIsDropletDetailsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateDropletModalOpen, setIsCreateDropletModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});

  const {
    droplets,
    stats,
    pagination,
    loading,
    statsLoading,
    error,
    loadDroplets,
    loadDropletStats,
    syncDroplet,
    restartDroplet,
    terminateDroplet,
    reprovisionDroplet,
    deleteDroplet,
    clearError
  } = useDroplets();

  const dispatch = useDispatch();
  const { showModal } = useYesNoModal();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load initial data
  useEffect(() => {
    loadDroplets({ page: currentPage, limit: pageSize });
    loadDropletStats();
  }, []);

  // Load data when filters change (excluding search term which is handled separately)
  useEffect(() => {
    const filters = {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm,
      status: filterStatus !== 'all' ? filterStatus : '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...advancedFilters
    };
    
    loadDroplets(filters);
  }, [currentPage, pageSize, debouncedSearchTerm, filterStatus, advancedFilters]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
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

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    loadDroplets({ page: 1, limit: newPageSize });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadDroplets({ page: newPage, limit: pageSize });
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

  // Filter modal handlers
  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setAdvancedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
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

  const exportToCSV = () => {
    if (!droplets || droplets.length === 0) {
      dispatch(showNotification('No droplets to export', 'warning'));
      return;
    }

    try {
      // Define CSV headers
      const headers = [
        'Droplet ID',
        'Name',
        'Status',
        'IP Address',
        'Size',
        'Region',
        'Created Date',
        'User',
        'Transaction',
        'Monthly Cost',
        'Memory (MB)',
        'vCPUs',
        'Disk (GB)',
        'Tags'
      ];

      // Convert droplets data to CSV format
      const csvData = droplets.map(droplet => [
        droplet.id || '',
        droplet.name || '',
        droplet.status || '',
        droplet.ipAddress || 'Not assigned',
        droplet.sizeSlug || '',
        droplet.regionSlug || '',
        formatDate(droplet.createdAt) || '',
        droplet.user || 'Unknown',
        droplet.transaction || 'N/A',
        droplet.priceMonthly ? droplet.priceMonthly.toFixed(2) : '0.00',
        droplet.memory || 'N/A',
        droplet.vcpus || 'N/A',
        droplet.disk || 'N/A',
        droplet.tags ? droplet.tags.join('; ') : ''
      ]);

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => {
          // Escape fields that contain commas, quotes, or newlines
          if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        }).join(','))
        .join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `droplets_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      dispatch(showNotification(`Successfully exported ${droplets.length} droplets to CSV`, 'success'));
    } catch (error) {
      console.error('Error exporting CSV:', error);
      dispatch(showNotification('Failed to export CSV. Please try again.', 'error'));
    }
  };

  const handleCreateDroplet = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/droplets/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show the message from the backend (which indicates background processing)
        const message = data.message || `Droplet "${data.droplet.name}" is being created.`;
        const notificationType = data.processing ? 'info' : 'success';
        
        dispatch(showNotification(message, notificationType));
        
        // Refresh the droplets list after a short delay to give the background process time to save to DB
        setTimeout(() => {
          loadDroplets({ page: currentPage, limit: pageSize });
          loadDropletStats();
        }, 2000);
      } else {
        const errorData = await response.json();
        dispatch(showNotification(`Failed to create droplet: ${errorData.message || 'Unknown error'}`, 'error'));
      }
    } catch (error) {
      console.error('Error creating droplet:', error);
      dispatch(showNotification('Failed to create droplet. Please try again.', 'error'));
    }
  };

  const handleAction = async (action, dropletId) => {
    try {
      let result;
      switch (action) {
        case 'sync':
          result = await syncDroplet(dropletId);
          if (result.success) {
            dispatch(showNotification(`Droplet ${dropletId} status synced successfully.`));
          } else {
            dispatch(showNotification(`Failed to sync droplet ${dropletId}: ${result.error}`));
          }
          break;
        case 'view':
          // Find the droplet by ID and open the details modal
          const droplet = droplets.find(d => d.id === dropletId);
          if (droplet) {
            setSelectedDroplet(droplet);
            setIsDropletDetailsModalOpen(true);
          }
          break;
        case 'restart':
          const restartConfirmed = await showModal('Are you sure you want to restart this droplet? This will cause a brief interruption in service.');
          if (restartConfirmed) {
            result = await restartDroplet(dropletId);
            if (result.success) {
              dispatch(showNotification(`Droplet ${dropletId} restart initiated successfully.`));
            } else {
              dispatch(showNotification(`Failed to restart droplet ${dropletId}: ${result.error}`));
            }
          }
          break;
        case 'terminate':
          const terminateConfirmed = await showModal('Are you sure you want to terminate this droplet? This will shut it down immediately.');
          if (terminateConfirmed) {
            result = await terminateDroplet(dropletId);
            if (result.success) {
              dispatch(showNotification(`Droplet ${dropletId} terminated successfully.`));
            } else {
              dispatch(showNotification(`Failed to terminate droplet ${dropletId}: ${result.error}`));
            }
          }
          break;
        case 'reprovision':
          const reprovisionConfirmed = await showModal('Are you sure you want to reprovision this droplet? This will reset it to its initial state and may cause data loss.');
          if (reprovisionConfirmed) {
            result = await reprovisionDroplet(dropletId);
            if (result.success) {
              dispatch(showNotification(`Droplet ${dropletId} reprovisioned successfully.`));
            } else {
              dispatch(showNotification(`Failed to reprovision droplet ${dropletId}: ${result.error}`));
            }
          }
          break;
        case 'delete':
          const confirmed = await showModal('Are you sure you want to delete this droplet? This action cannot be undone.');
          if (confirmed) {
            result = await deleteDroplet(dropletId);
            if (result.success) {
              dispatch(showNotification(`Droplet ${dropletId} deleted successfully.`));
            } else {
              dispatch(showNotification(`Failed to delete droplet ${dropletId}: ${result.error}`));
            }
          }
          break;
        default:
          console.log(`Unknown action: ${action} for droplet: ${dropletId}`);
      }
    } catch (error) {
      console.error(`Error performing action ${action} on droplet ${dropletId}:`, error);
      dispatch(showNotification(`Error performing action ${action} on droplet ${dropletId}: ${error.message}`));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Droplet Management</h2>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Manage all provisioned droplets and their status</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsCreateDropletModalOpen(true)}
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
            Create Droplet
          </button>
          <button 
            onClick={() => {
              loadDroplets({ page: currentPage, limit: pageSize });
              loadDropletStats();
            }}
            disabled={loading || statsLoading}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'oklch(0.50 0.05 280)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.50 0.05 280 / 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.50 0.05 280)';
              }
            }}
          >
            <i className="fas fa-sync mr-2"></i>
            Refresh
          </button>
          <button 
            onClick={exportToCSV}
            disabled={loading || droplets.length === 0}
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
            <i className="fas fa-download mr-2"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
                <i className="fas fa-server" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Total Droplets</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.totalDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
                <i className="fas fa-check" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Active</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.activeDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)' }}>
                <i className="fas fa-clock" style={{ color: 'oklch(0.85 0.18 130)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>New</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.newDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.2)' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: 'oklch(0.55 0.22 25)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Off</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.offDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)' }}>
                <i className="fas fa-dollar-sign" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Monthly Cost</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {statsLoading ? <LoadingSpinner size="sm" /> : `$${stats.totalMonthlyCost}`}
              </p>
            </div>
          </div>
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
              Search Droplets
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, IP, or user..."
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

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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

          {/* Project Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Project
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
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
              <option value="all">All Projects</option>
              <option value="Edify Engine">Edify Engine</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end">
            <button 
              onClick={handleOpenFilterModal}
              className="w-full px-4 py-2 rounded-md transition-colors"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
              }}
            >
              <i className="fas fa-filter mr-2"></i>
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* Droplets Table */}
      <div 
        className="rounded-lg shadow overflow-hidden"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
          <h3 className="text-lg font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
            Droplets ({loading ? '...' : pagination.total})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
              <span className="ml-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading droplets...</span>
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-4 text-center">
            <div className="p-4 rounded-lg" style={{ color: 'oklch(0.55 0.22 25)', backgroundColor: 'oklch(0.55 0.22 25 / 0.1)' }}>
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          </div>
        ) : droplets.length === 0 ? (
          <div className="px-6 py-8 text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
            <i className="fas fa-server text-4xl mb-4"></i>
            <p className="text-lg font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>No droplets found</p>
            <p className="text-sm">Try adjusting your filters or create a new droplet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                <tr style={{ borderBottom: '1px solid oklch(0.25 0.05 285)' }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Droplet Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Linked User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {droplets.map((droplet) => (
                  <tr 
                    key={droplet.id}
                    style={{
                      backgroundColor: 'oklch(0.18 0.05 285)',
                      borderBottom: '1px solid oklch(0.25 0.05 285)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <button
                          onClick={() => handleDropletClick(droplet.name)}
                          className="text-sm font-medium hover:underline transition-colors duration-200 flex items-center group"
                          style={{ color: 'oklch(0.45 0.15 290)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.45 0.15 290)'; }}
                          title="Open droplet website"
                        >
                          {droplet.name}
                          <i className="fas fa-external-link-alt ml-1 text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-200"></i>
                        </button>
                        <div className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>{droplet.ipAddress || 'No IP'}</div>
                        <div className="text-xs" style={{ color: 'oklch(0.50 0.05 280)' }}>{droplet.sizeSlug} • {droplet.regionSlug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {formatDate(droplet.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{droplet.user}</div>
                      <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>Transaction: {shortAddress(droplet.transaction) || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getStatusColor(droplet.status)}>
                        {droplet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      ${droplet.priceMonthly ? droplet.priceMonthly.toFixed(2) : '0.00'}/month
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAction('view', droplet.id)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.45 0.15 290)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.45 0.15 290)'; }}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleAction('sync', droplet.id)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.70 0.15 150)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                          title="Sync Status"
                        >
                          <i className="fas fa-sync"></i>
                        </button>
                        {droplet.status === 'active' && (
                          <>
                            <button 
                              onClick={() => handleAction('restart', droplet.id)}
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ color: 'oklch(0.85 0.18 130)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.90 0.18 130)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.85 0.18 130)'; }}
                              title="Restart"
                            >
                              <i className="fas fa-redo"></i>
                            </button>
                            <button 
                              onClick={() => handleAction('terminate', droplet.id)}
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ color: 'oklch(0.55 0.22 25)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.60 0.22 25)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.22 25)'; }}
                              title="Terminate"
                            >
                              <i className="fas fa-stop"></i>
                            </button>
                          </>
                        )}
                        {droplet.status === 'off' && (
                          <button 
                            onClick={() => handleAction('reprovision', droplet.id)}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: 'oklch(0.70 0.15 150)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                            title="Reprovision"
                          >
                            <i className="fas fa-play"></i>
                          </button>
                        )}
                        <button 
                          onClick={() => handleAction('delete', droplet.id)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.55 0.22 25)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.60 0.22 25)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.22 25)'; }}
                          title="Delete"
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

        {/* Pagination */}
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

      {/* Droplet Details Modal */}
      <DropletDetailsModal
        open={isDropletDetailsModalOpen}
        droplet={selectedDroplet}
        onClose={() => {
          setIsDropletDetailsModalOpen(false);
          setSelectedDroplet(null);
        }}
      />

      {/* Droplet Filter Modal */}
      <DropletFilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
        currentFilters={advancedFilters}
      />

      {/* Create Droplet Modal */}
      <CreateDropletModal
        open={isCreateDropletModalOpen}
        onClose={() => setIsCreateDropletModalOpen(false)}
        onCreateDroplet={handleCreateDroplet}
      />
    </div>
  );
};

export default DropletManagement; 