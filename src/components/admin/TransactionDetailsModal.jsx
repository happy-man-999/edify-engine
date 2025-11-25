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
      case 'success': return { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' };
      case 'failed': return { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' };
      case 'pending': return { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' };
      default: return { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' };
    }
  };

  const getPaymentMethodColor = (method) => {
    return method === 'Stripe' 
      ? { backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }
      : { backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' };
  };

  if (!open || !transaction) return null;

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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
              <span className="ml-3" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading transaction details...</span>
            </div>
          ) : transactionDetails ? (
            <div className="space-y-6">
              {/* Transaction ID and Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Transaction ID</h3>
                  <p className="text-sm font-mono" style={{ color: 'oklch(0.65 0.05 280)' }}>{transactionDetails.id}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={getStatusColor(transactionDetails.status)}>
                    {transactionDetails.status}
                  </span>
                </div>
              </div>

              {/* Amount and Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Payment Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Amount</label>
                      <p className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {formatAmount(transactionDetails.amount, transactionDetails.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Payment Method</label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getPaymentMethodColor(transactionDetails.paymentMethod)}>
                        {transactionDetails.paymentMethod}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Date</label>
                      <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{formatDate(transactionDetails.date)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Transaction Details
                  </h4>
                  <div className="space-y-3">
                    {transactionDetails.txHash && (
                      <div>
                        <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Transaction Hash</label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-mono truncate" style={{ color: 'oklch(0.98 0.01 280)' }}>{transactionDetails.txHash}</p>
                          <a 
                            href={`https://solscan.io/tx/${transactionDetails.txHash}/?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'oklch(0.45 0.15 290)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </a>
                        </div>
                      </div>
                    )}
                    {transactionDetails.item && (
                      <div>
                        <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Item</label>
                        <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{transactionDetails.item}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Refunded</label>
                      <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {transactionDetails.refunded ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h4 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  User Information
                </h4>
                <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Name</label>
                      <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{transactionDetails.user}</p>
                    </div>
                    {transactionDetails.userEmail && (
                      <div>
                        <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Email</label>
                        <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{transactionDetails.userEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {transactionDetails.item && (
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Item Information
                  </h4>
                  <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                    <div>
                      <label className="block text-xs font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Item Name</label>
                      <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{transactionDetails.item}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-triangle text-4xl mb-4" style={{ color: 'oklch(0.50 0.05 280)' }}></i>
              <p style={{ color: 'oklch(0.65 0.05 280)' }}>Failed to load transaction details</p>
              <button 
                onClick={fetchTransactionDetails}
                className="mt-4 px-4 py-2 rounded-md transition-colors"
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