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
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h2 className="text-xl font-semibold text-gray-900">Payment Activity</h2>
          <p className="text-sm text-gray-600">Monitor all payment transactions and revenue</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-download mr-2"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-dollar-sign text-green-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalUSD}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-coins text-purple-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total SOL</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSOL} SOL</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-blue-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Successful</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.successful}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-times text-red-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="stripe">Stripe</option>
              <option value="solana">Solana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-filter mr-2"></i>
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Transactions ({pagination.total})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading transactions...</span>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <i className="fas fa-inbox text-4xl mb-4"></i>
            <p>No transactions found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shortAddress(transaction.id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.paymentMethod === 'Stripe' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openTransactionDetails(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {transaction.txHash && (
                        <a 
                          href={`https://solscan.io/tx/${transaction.txHash}/?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
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
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-700">
                    <label htmlFor="page-size" className="mr-2 text-sm font-medium text-gray-700">
                      Show
                    </label>
                    <select
                      id="page-size"
                      value={pageSize}
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
          </>
        )}
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Filter
                  </label>
                  <select
                    value={advancedFilters.amountOperator}
                    onChange={(e) => handleFilterChange('amountOperator', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All amounts</option>
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                    <option value="between">Between</option>
                  </select>
                </div>

                {advancedFilters.amountOperator === 'greater' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={advancedFilters.amountMin}
                      onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {advancedFilters.amountOperator === 'less' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={advancedFilters.amountMax}
                      onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {advancedFilters.amountOperator === 'between' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Min"
                        value={advancedFilters.amountMin}
                        onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Max"
                        value={advancedFilters.amountMax}
                        onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Currency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={advancedFilters.currency}
                    onChange={(e) => handleFilterChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All currencies</option>
                    <option value="USD">USD</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        value={advancedFilters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        value={advancedFilters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#42677D] to-[#5E8EA9] text-white rounded-lg hover:from-[#3A5F73] hover:to-[#4F7A8F] transition-all duration-200 font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
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