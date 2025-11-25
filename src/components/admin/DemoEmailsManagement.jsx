import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useYesNoModal } from '../../hooks/useYesNoModal';
import { showNotification } from '../../store/uiSlice';

const DemoEmailsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [demoEmails, setDemoEmails] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [pageSize, setPageSize] = useState(10);
  const [clearing, setClearing] = useState(false);

  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { showModal } = useYesNoModal();

  // Fetch demo emails statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/demo-emails/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch demo emails statistics');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load demo emails statistics');
    }
  };

  // Fetch demo emails
  const fetchDemoEmails = async (page = 1, limit = pageSize) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearchTerm,
        source: filterSource !== 'all' ? filterSource : '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/admin/demo-emails?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch demo emails');
      }

      const data = await response.json();
      setDemoEmails(data.demoEmails);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching demo emails:', error);
      setError('Failed to load demo emails');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (token) {
      fetchStats();
      fetchDemoEmails();
    }
  }, [token]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Refetch when filters change
  useEffect(() => {
    if (token) {
      fetchDemoEmails(1, pageSize);
    }
  }, [debouncedSearchTerm, filterSource, pageSize]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (newPage) => {
    fetchDemoEmails(newPage, pageSize);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Email', 'Source', 'IP Address', 'User Agent', 'Referer', 'Created At'];
    const rows = demoEmails.map(email => [
      email.email,
      email.source || 'N/A',
      email.ipAddress || 'N/A',
      email.userAgent || 'N/A',
      email.referer || 'N/A',
      formatDate(email.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demo-emails-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleClear = async () => {
    try {
      const confirmed = await showModal('Are you sure you want to clear all demo emails? This action cannot be undone.');
      
      if (!confirmed) {
        return;
      }

      setClearing(true);
      setError(null);

      const response = await fetch('/api/admin/demo-emails', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear demo emails');
      }

      const data = await response.json();
      
      // Refresh stats and emails list
      await fetchStats();
      await fetchDemoEmails(1, pageSize);
      
      dispatch(showNotification(`Successfully cleared ${data.deletedCount} demo email(s)`));
    } catch (error) {
      console.error('Error clearing demo emails:', error);
      setError('Failed to clear demo emails');
      dispatch(showNotification('Failed to clear demo emails'));
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="text-sm font-medium mb-1" style={{ color: 'oklch(0.45 0.15 290)' }}>Total Emails</div>
          <div className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.total}</div>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="text-sm font-medium mb-1" style={{ color: 'oklch(0.70 0.15 150)' }}>Today</div>
          <div className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.today}</div>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="text-sm font-medium mb-1" style={{ color: 'oklch(0.50 0.18 260)' }}>This Week</div>
          <div className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.thisWeek}</div>
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="text-sm font-medium mb-1" style={{ color: 'oklch(0.85 0.18 130)' }}>This Month</div>
          <div className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.thisMonth}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by email or IP address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42677D] focus:border-transparent"
            />
            <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
          </div>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42677D] focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="demo-world">Demo World</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            disabled={clearing || loading}
            className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'oklch(0.70 0.15 150)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.75 0.15 150)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'oklch(0.70 0.15 150)';
              }
            }}
          >
            {clearing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Clearing...
              </>
            ) : (
              <>
                <i className="fas fa-trash"></i>
                Clear All
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
            <i className="fas fa-download"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* Demo Emails Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42677D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading demo emails...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : demoEmails.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No demo emails found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table 
              className="min-w-full rounded-lg"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderCollapse: 'separate',
                borderSpacing: 0
              }}
            >
              <thead style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                <tr style={{ borderBottom: '1px solid oklch(0.25 0.05 285)' }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    User Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Referer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {demoEmails.map((email) => (
                  <tr 
                    key={email._id}
                    style={{
                      backgroundColor: 'oklch(0.18 0.05 285)',
                      borderBottom: '1px solid oklch(0.25 0.05 285)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {email.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>
                        {email.source || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      {email.ipAddress || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate" style={{ color: 'oklch(0.65 0.05 280)' }} title={email.userAgent || 'N/A'}>
                      {email.userAgent || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate" style={{ color: 'oklch(0.65 0.05 280)' }} title={email.referer || 'N/A'}>
                      {email.referer || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      {formatDate(email.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span className="px-4 py-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DemoEmailsManagement;

