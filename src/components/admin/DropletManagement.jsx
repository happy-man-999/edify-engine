import React, { useState, useEffect, useCallback } from 'react';
import { useDroplets } from '../../hooks/useDroplets';
import LoadingSpinner from '../LoadingSpinner';
import { shortAddress } from '../../utils/format';
import DropletDetailsModal from './DropletDetailsModal';
import DropletFilterModal from './DropletFilterModal';

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
    
    // Debug: Log the filters being sent
    console.log('Sending filters to API:', filters);
    
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
    console.log('Applying advanced filters:', filters);
    setAdvancedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleAction = async (action, dropletId) => {
    try {
      switch (action) {
        case 'sync':
          await syncDroplet(dropletId);
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
          await restartDroplet(dropletId);
          break;
        case 'terminate':
          await terminateDroplet(dropletId);
          break;
        case 'reprovision':
          await reprovisionDroplet(dropletId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this droplet? This action cannot be undone.')) {
            await deleteDroplet(dropletId);
          }
          break;
        default:
          console.log(`Unknown action: ${action} for droplet: ${dropletId}`);
      }
    } catch (error) {
      console.error(`Error performing action ${action} on droplet ${dropletId}:`, error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Droplet Management</h2>
          <p className="text-sm text-gray-600">Manage all provisioned droplets and their status</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              loadDroplets({ page: currentPage, limit: pageSize });
              loadDropletStats();
            }}
            disabled={loading || statsLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-sync mr-2"></i>
            Refresh
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-download mr-2"></i>
            Export CSV
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <i className="fas fa-plus mr-2"></i>
            Create Droplet
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-server text-green-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Droplets</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.totalDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.activeDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.newDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Off</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? <LoadingSpinner size="sm" /> : stats.offDroplets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-dollar-sign text-blue-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Cost</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? <LoadingSpinner size="sm" /> : `$${stats.totalMonthlyCost}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Droplets
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, IP, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects</option>
              <option value="Edify Engine">Edify Engine</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end">
            <button 
              onClick={handleOpenFilterModal}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-filter mr-2"></i>
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* Droplets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Droplets ({loading ? '...' : pagination.total})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading droplets...</span>
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-4 text-center">
            <div className="text-red-600 bg-red-50 p-4 rounded-lg">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          </div>
        ) : droplets.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-500">
              <i className="fas fa-server text-4xl mb-4"></i>
              <p className="text-lg font-medium">No droplets found</p>
              <p className="text-sm">Try adjusting your filters or create a new droplet.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Droplet Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Linked User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {droplets.map((droplet) => (
                  <tr key={droplet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{droplet.name}</div>
                        <div className="text-sm text-gray-500">{droplet.ipAddress || 'No IP'}</div>
                        <div className="text-xs text-gray-400">{droplet.sizeSlug} • {droplet.regionSlug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(droplet.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{droplet.user}</div>
                      <div className="text-xs text-gray-500">Transaction: {shortAddress(droplet.transaction) || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(droplet.status)}`}>
                        {droplet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${droplet.priceMonthly ? droplet.priceMonthly.toFixed(2) : '0.00'}/month
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAction('view', droplet.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleAction('sync', droplet.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Sync Status"
                        >
                          <i className="fas fa-sync"></i>
                        </button>
                        {droplet.status === 'active' && (
                          <>
                            <button 
                              onClick={() => handleAction('restart', droplet.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Restart"
                            >
                              <i className="fas fa-redo"></i>
                            </button>
                            <button 
                              onClick={() => handleAction('terminate', droplet.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Terminate"
                            >
                              <i className="fas fa-stop"></i>
                            </button>
                          </>
                        )}
                        {droplet.status === 'off' && (
                          <button 
                            onClick={() => handleAction('reprovision', droplet.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Reprovision"
                          >
                            <i className="fas fa-play"></i>
                          </button>
                        )}
                        <button 
                          onClick={() => handleAction('delete', droplet.id)}
                          className="text-red-600 hover:text-red-900"
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
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <label htmlFor="page-size" className="mr-2 text-sm font-medium text-gray-700">
                  Show
                </label>
                <select
                  id="page-size"
                  value={pagination.limit}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  per page
                </span>
              </div>
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                      page === pagination.page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : page === '...'
                        ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default DropletManagement; 