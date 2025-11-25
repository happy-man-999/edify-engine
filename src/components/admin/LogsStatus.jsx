import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shortAddress } from '../../utils/format';
import LogDetailsModal from './LogDetailsModal';

const LogsStatus = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    errorCount: 0,
    successCount: 0,
    warningCount: 0,
    infoCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
      limit: 10,
    total: 0,
    pages: 0
  });
  const [expandedWebhookPayloadIds, setExpandedWebhookPayloadIds] = useState(() => new Set());
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const { token } = useSelector(state => state.auth);

  // Debounce searchTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        level: filterLevel,
        type: filterType,
        search: debouncedSearchTerm,
        startDate: startDate,
        endDate: endDate
      });

      const response = await fetch(`/api/admin/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/logs/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filterType, filterLevel, debouncedSearchTerm, startDate, endDate, pagination.page, pagination.limit]);

  const handleRefresh = () => {
    fetchLogs();
    fetchStats();
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        level: filterLevel,
        type: filterType
      });

      const response = await fetch(`/api/admin/logs/export?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export logs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logs.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting logs:', error);
      setError('Failed to export logs');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'success': return { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' };
      case 'error': return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      case 'warning': return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      case 'info': return { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' };
      default: return { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' };
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'user_signup': return { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' };
      case 'user_created': return { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' };
      case 'user_updated': return { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' };
      case 'user_deleted': return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      case 'user_role_changed': return { backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' };
      case 'purchase': return { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' };
      case 'transaction_created': return { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' };
      case 'droplet_created': return { backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' };
      case 'droplet_restarted': return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      case 'droplet_terminated': return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      case 'droplet_reprovisioned': return { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' };
      case 'droplet_deleted': return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      case 'subdomain_assigned': return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      case 'webhook': return { backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' };
      case 'provisioning': return { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' };
      case 'error': return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      case 'item_status_changed': return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      case 'item_files_deleted': return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      default: return { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' };
    }
  };

  const getDisplayMessage = (log) => {
    try {
      if (log && log.details && log.details.signature) {
        const sig = String(log.details.signature);
        return String(log.message).replace(sig, shortAddress(sig));
      }
      return log.message;
    } catch (e) {
      return log.message;
    }
  };

  const toggleWebhookPayload = (id) => {
    setExpandedWebhookPayloadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setSelectedLog(null);
  };

  const handleReprocess = (logId) => {
    console.log(`Reprocess log: ${logId}`);
    // Implement reprocessing logic
  };

  const handleReprovision = (logId) => {
    console.log(`Reprovision based on log: ${logId}`);
    // Implement reprovisioning logic
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, limit: newPageSize, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

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

  if (loading && logs.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-triangle text-red-400"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading logs</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Logs & Status</h2>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Monitor API logs, webhooks, and system status</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-lg transition-colors"
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
            <i className="fas fa-download mr-2"></i>
            Export Logs
          </button>
          <button 
            onClick={handleRefresh}
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
            <i className="fas fa-sync mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)' }}>
                <i className="fas fa-list" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Total Logs</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.totalLogs}</p>
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
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Success</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.successCount}</p>
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
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Errors</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.errorCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)' }}>
                <i className="fas fa-info" style={{ color: 'oklch(0.85 0.18 130)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Info</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.infoCount}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Search Logs</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search log messages..."
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Log Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
              <option value="all">All Types</option>
              <option value="user_signup">User Signup</option>
              <option value="user_created">User Created</option>
              <option value="user_updated">User Updated</option>
              <option value="user_deleted">User Deleted</option>
              <option value="user_role_changed">User Role Changed</option>
              <option value="purchase">Purchase</option>
              <option value="transaction_created">Transaction Created</option>
              <option value="droplet_created">Droplet Created</option>
              <option value="droplet_restarted">Droplet Restarted</option>
              <option value="droplet_terminated">Droplet Terminated</option>
              <option value="droplet_reprovisioned">Droplet Reprovisioned</option>
              <option value="droplet_deleted">Droplet Deleted</option>
              <option value="subdomain_assigned">Subdomain Assigned</option>
              <option value="webhook">Webhook</option>
              <option value="provisioning">Provisioning</option>
              <option value="error">Error</option>
              <option value="item_status_changed">Item Status Changed</option>
              <option value="item_files_deleted">Item Files Deleted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Log Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
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
              <option value="all">All Levels</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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

      {/* Logs Table */}
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
            API Logs ({logs.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
              <tr style={{ borderBottom: '1px solid oklch(0.25 0.05 285)' }}>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr 
                  key={log._id}
                  style={{
                    backgroundColor: 'oklch(0.18 0.05 285)',
                    borderBottom: '1px solid oklch(0.25 0.05 285)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getLevelColor(log.level)}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getTypeColor(log.type)}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{getDisplayMessage(log)}</div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <>
                        {log.type === 'webhook' ? (
                          <div className="mt-1">
                            <div className="text-xs space-x-3" style={{ color: 'oklch(0.65 0.05 280)' }}>
                              {log.details.webhookType && (
                                <span>webhookType: {String(log.details.webhookType)}</span>
                              )}
                              {log.details.source && (
                                <span>source: {String(log.details.source)}</span>
                              )}
                            </div>
                            {log.details.payload && (
                              <div className="mt-2">
                                <button
                                  type="button"
                                  onClick={() => toggleWebhookPayload(log._id)}
                                  className="text-xs hover:underline"
                                  style={{ color: 'oklch(0.45 0.15 290)' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.45 0.15 290)'; }}
                                >
                                  {expandedWebhookPayloadIds.has(log._id) ? 'Hide payload' : 'Show payload'}
                                </button>
                                {expandedWebhookPayloadIds.has(log._id) && (
                                  <pre className="mt-2 text-xs rounded p-3 overflow-x-auto" style={{ backgroundColor: 'oklch(0.12 0.02 280)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid', color: 'oklch(0.98 0.01 280)' }}>
                                    {JSON.stringify(log.details.payload, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                            {Object.entries(log.details).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                {key}: {key === 'signature'
                                  ? shortAddress(String(value))
                                  : (typeof value === 'object' ? JSON.stringify(value) : String(value))}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(log)}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: 'oklch(0.45 0.15 290)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.45 0.15 290)'; }}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {log.level === 'error' && log.type === 'webhook' && (
                        <button 
                          onClick={() => handleReprocess(log._id)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.85 0.18 130)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.90 0.18 130)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.85 0.18 130)'; }}
                          title="Reprocess Webhook"
                        >
                          <i className="fas fa-redo"></i>
                        </button>
                      )}
                      {log.type === 'provisioning' && log.status === 'failed' && (
                        <button 
                          onClick={() => handleReprovision(log._id)}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.70 0.15 150)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                          title="Reprovision"
                        >
                          <i className="fas fa-sync"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      <LogDetailsModal open={isLogModalOpen} log={selectedLog} onClose={handleCloseLogModal} />
    </div>
  );
};

export default LogsStatus; 