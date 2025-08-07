import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TransactionDetailsModal = ({ open, transaction, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const { token } = useSelector(state => state.auth);

  // Fetch detailed transaction information
  useEffect(() => {
    if (open && transaction) {
      fetchTransactionDetails();
    }
  }, [open, transaction]);

  const fetchTransactionDetails = async () => {
    if (!transaction?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/transactions/${transaction.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction details');
      }

      const data = await response.json();
      setTransactionDetails(data.transaction);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    } finally {
      setLoading(false);
    }
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

  const formatAmount = (amount, currency) => {
    return currency === 'SOL' ? `${amount} SOL` : `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method) => {
    return method === 'Stripe' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Transaction Details</h2>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading transaction details...</span>
            </div>
          ) : transactionDetails ? (
            <div className="space-y-6">
              {/* Transaction ID and Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Transaction ID</h3>
                  <p className="text-sm text-gray-600 font-mono">{transactionDetails.id}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transactionDetails.status)}`}>
                    {transactionDetails.status}
                  </span>
                </div>
              </div>

              {/* Amount and Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Payment Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Amount</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatAmount(transactionDetails.amount, transactionDetails.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Payment Method</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(transactionDetails.paymentMethod)}`}>
                        {transactionDetails.paymentMethod}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Date</label>
                      <p className="text-sm text-gray-900">{formatDate(transactionDetails.date)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Transaction Details
                  </h4>
                  <div className="space-y-3">
                    {transactionDetails.txHash && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Transaction Hash</label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-900 font-mono truncate">{transactionDetails.txHash}</p>
                          <a 
                            href={`https://solscan.io/tx/${transactionDetails.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </a>
                        </div>
                      </div>
                    )}
                    {transactionDetails.item && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Item</label>
                        <p className="text-sm text-gray-900">{transactionDetails.item}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Refunded</label>
                      <p className="text-sm text-gray-900">
                        {transactionDetails.refunded ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  User Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{transactionDetails.user}</p>
                    </div>
                    {transactionDetails.userEmail && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-900">{transactionDetails.userEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {transactionDetails.item && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Item Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Item Name</label>
                      <p className="text-sm text-gray-900">{transactionDetails.item}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Failed to load transaction details</p>
              <button 
                onClick={fetchTransactionDetails}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal; 