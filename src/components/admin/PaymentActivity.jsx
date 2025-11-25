import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shortAddress } from '../../utils/format';
import TransactionDetailsModal from './TransactionDetailsModal';

const PaymentActivity = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalUSD: '0.00',
    totalSOL: '0.0000',
    successful: 0,
    failed: 0,
    pending: 0,
    recent: 0
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    amountMin: '',
    amountMax: '',
    amountOperator: 'all', // all, greater, less, between
    dateFrom: '',
    dateTo: '',
    currency: 'all' // all, USD, SOL
  });

  const { token } = useSelector(state => state.auth);

  // Fetch transaction statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/transactions/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction statistics');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load transaction statistics');
    }
  };

  // Fetch transactions
  const fetchTransactions = async (page = 1, limit = pageSize) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearchTerm,
        paymentMethod: filterType,
        status: filterStatus,
        sortBy: 'date',
        sortOrder: 'desc'
      });

      // Add advanced filters
      if (advancedFilters.amountOperator !== 'all') {
        params.append('amountOperator', advancedFilters.amountOperator);
        if (advancedFilters.amountMin) params.append('amountMin', advancedFilters.amountMin);
        if (advancedFilters.amountMax) params.append('amountMax', advancedFilters.amountMax);
      }
      if (advancedFilters.dateFrom) params.append('dateFrom', advancedFilters.dateFrom);
      if (advancedFilters.dateTo) params.append('dateTo', advancedFilters.dateTo);
      if (advancedFilters.currency !== 'all') params.append('currency', advancedFilters.currency);

      const response = await fetch(`/api/admin/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (token) {
      fetchStats();
      fetchTransactions();
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
      fetchTransactions(1, pageSize);
    }
  }, [debouncedSearchTerm, filterType, filterStatus, pageSize, advancedFilters]);

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
      case 'success': return { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' };
      case 'failed': return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      case 'pending': return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      default: return { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' };
    }
  };

  const formatAmount = (amount, currency) => {
    return currency === 'SOL' ? `${amount} SOL` : `$${amount.toFixed(2)}`;
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    fetchTransactions(1, newPageSize);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchTransactions(newPage, pageSize);
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

  // Filter modal functions
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const applyFilters = () => {
    closeFilterModal();
    fetchTransactions(1, pageSize);
  };

  const clearFilters = () => {
    setAdvancedFilters({
      amountMin: '',
      amountMax: '',
      amountOperator: 'all',
      dateFrom: '',
      dateTo: '',
      currency: 'all'
    });
    setSearchTerm('');
    setDebouncedSearchTerm('');
    closeFilterModal();
    fetchTransactions(1, pageSize);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    fetchTransactions(1, pageSize);
  };

  const handleFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Transaction details modal functions
  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailsModalOpen(true);
  };

  const closeTransactionDetails = () => {
    setIsTransactionDetailsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Transaction ID', 'User', 'Amount', 'Payment Method', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(tx => [
        tx.id,
        `"${tx.user}"`,
        formatAmount(tx.amount, tx.currency),
        tx.paymentMethod,
        tx.status,
        formatDate(tx.date)
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-red-400"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => fetchTransactions()}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Try again
              </button>
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
          <h2 className="text-xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Payment Activity</h2>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Monitor all payment transactions and revenue</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
                <i className="fas fa-dollar-sign" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Total Revenue</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>${stats.totalUSD}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}>
                <i className="fas fa-coins" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Total SOL</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.totalSOL} SOL</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)' }}>
                <i className="fas fa-check" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Successful</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.successful}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.2)' }}>
                <i className="fas fa-times" style={{ color: 'oklch(0.55 0.22 25)' }}></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Failed</p>
              <p className="text-2xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>{stats.failed}</p>
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
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
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
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Payment Method</label>
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
              <option value="all">All Methods</option>
              <option value="stripe">Stripe</option>
              <option value="solana">Solana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Status</label>
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
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={openFilterModal}
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

      {/* Transactions Table */}
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
            Transactions ({pagination.total})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
              <span className="ml-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading transactions...</span>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
            <i className="fas fa-inbox text-4xl mb-4"></i>
            <p>No transactions found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                  <tr style={{ borderBottom: '1px solid oklch(0.25 0.05 285)' }}>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr 
                      key={transaction.id}
                      style={{
                        backgroundColor: 'oklch(0.18 0.05 285)',
                        borderBottom: '1px solid oklch(0.25 0.05 285)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>{shortAddress(transaction.id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{transaction.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {formatAmount(transaction.amount, transaction.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={
                            transaction.paymentMethod === 'Stripe' 
                              ? { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }
                              : { backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' }
                          }
                        >
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openTransactionDetails(transaction)}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: 'oklch(0.45 0.15 290)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.45 0.15 290)'; }}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {transaction.txHash && (
                        <a 
                          href={`https://solscan.io/tx/${transaction.txHash}/?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.70 0.15 150)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                          title="View on Solscan"
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                      )}
                    </div>
                  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    <label htmlFor="page-size" className="mr-2 text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      Show
                    </label>
                    <select
                      id="page-size"
                      value={pageSize}
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
          </>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div 
            className="rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn"
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
                <h2 className="text-xl font-bold">Advanced Filters</h2>
                <button
                  onClick={closeFilterModal}
                  className="text-white/80 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Amount Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    Amount Filter
                  </label>
                  <select
                    value={advancedFilters.amountOperator}
                    onChange={(e) => handleFilterChange('amountOperator', e.target.value)}
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
                    <option value="all">All amounts</option>
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                    <option value="between">Between</option>
                  </select>
                </div>

                {advancedFilters.amountOperator === 'greater' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      Minimum Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={advancedFilters.amountMin}
                      onChange={(e) => handleFilterChange('amountMin', e.target.value)}
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
                )}

                {advancedFilters.amountOperator === 'less' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      Maximum Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={advancedFilters.amountMax}
                      onChange={(e) => handleFilterChange('amountMax', e.target.value)}
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
                )}

                {advancedFilters.amountOperator === 'between' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        Min Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Min"
                        value={advancedFilters.amountMin}
                        onChange={(e) => handleFilterChange('amountMin', e.target.value)}
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
                      <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        Max Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Max"
                        value={advancedFilters.amountMax}
                        onChange={(e) => handleFilterChange('amountMax', e.target.value)}
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
                )}

                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    Currency
                  </label>
                  <select
                    value={advancedFilters.currency}
                    onChange={(e) => handleFilterChange('currency', e.target.value)}
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
                    <option value="all">All currencies</option>
                    <option value="USD">USD</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'oklch(0.65 0.05 280)' }}>From</label>
                      <input
                        type="date"
                        value={advancedFilters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
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
                      <label className="block text-xs font-medium mb-1" style={{ color: 'oklch(0.65 0.05 280)' }}>To</label>
                      <input
                        type="date"
                        value={advancedFilters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
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
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                  style={{
                    background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                    color: 'oklch(0.98 0.01 280)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                  }}
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        open={isTransactionDetailsModalOpen}
        transaction={selectedTransaction}
        onClose={closeTransactionDetails}
      />
    </div>
  );
};

export default PaymentActivity; 