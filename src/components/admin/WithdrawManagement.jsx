import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWalletWithRedirects } from '../../hooks/useWalletWithRedirects';
import { useCurrency } from '../../hooks/useCurrency';
import { sendSOLWithReference } from '../../utils/paySolana';
import { showNotification } from '../../store/uiSlice';
import { shortAddress } from '../../utils/format';

export default function WithdrawManagement() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // approve or reject
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailWithdrawal, setDetailWithdrawal] = useState(null);
  const [solanaNetwork, setSolanaNetwork] = useState('devnet');
  
  const dispatch = useDispatch();
  const { connected: solanaConnected } = useWalletWithRedirects();
  const { convertUsdToSol } = useCurrency();

  // Fetch Solana network settings
  useEffect(() => {
    const fetchNetworkSettings = async () => {
      try {
        const response = await fetch('/api/admin/payment-settings');
        if (response.ok) {
          const { settings } = await response.json();
          const solanaMode = settings.solanaMode || 'devnet';
          const isTestMode = settings.isTestMode || false;
          const effectiveMode = isTestMode ? 'devnet' : solanaMode;
          setSolanaNetwork(effectiveMode);
        }
      } catch (error) {
        console.warn('Failed to fetch network settings:', error);
      }
    };
    fetchNetworkSettings();
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [filter, page]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const response = await fetch(`/api/withdrawals?page=${page}&limit=20${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (withdrawal) => {
    setDetailWithdrawal(withdrawal);
    setShowDetailModal(true);
  };

  const handleApprove = async (withdrawal) => {
    // Check if user has Solana address
    const solanaAddress = withdrawal.solanaAddress || withdrawal.user?.solanaAddress;
    if (!solanaAddress) {
      dispatch(showNotification('User has no Solana address linked. Cannot process withdrawal.', 'error'));
      return;
    }

    // Check if wallet is connected
    if (!solanaConnected) {
      dispatch(showNotification('Please connect your Solana wallet first to process the withdrawal payment.', 'error'));
      return;
    }

    try {
      // Fetch withdrawal approval details (amount in SOL, etc.)
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/withdrawals/${withdrawal._id}/approve-details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get withdrawal details');
      }

      const data = await response.json();
      setPaymentDetails(data);
      setSelectedWithdrawal(withdrawal);
      setActionType('approve');
      setShowActionModal(true);
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
      dispatch(showNotification(error.message || 'Failed to get withdrawal details', 'error'));
    }
  };

  const handleReject = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setActionType('reject');
    setShowActionModal(true);
  };

  const processWithdrawalPayment = async () => {
    if (!selectedWithdrawal || !paymentDetails) return;

    if (!solanaConnected) {
      alert('Please connect your Solana wallet first.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Send SOL payment to user's address
      const reference = `Withdrawal-${selectedWithdrawal._id}`;
      const signature = await sendSOLWithReference(
        paymentDetails.solanaAddress,
        paymentDetails.amountSOL,
        reference
      );

      // Confirm payment with backend
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/withdrawals/${selectedWithdrawal._id}/confirm-payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentSignature: signature,
          notes
        })
      });

      if (response.ok) {
        setShowActionModal(false);
        setSelectedWithdrawal(null);
        setPaymentDetails(null);
        setNotes('');
        fetchWithdrawals();
        dispatch(showNotification(`Withdrawal approved! Payment signature: ${signature.substring(0, 8)}...`));
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to confirm payment');
      }
    } catch (error) {
      console.error('Error processing withdrawal payment:', error);
      dispatch(showNotification(error.message || 'Payment failed. Please try again.', 'error'));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const submitAction = async () => {
    if (!selectedWithdrawal) return;

    // For approve, process payment instead of direct API call
    if (actionType === 'approve') {
      await processWithdrawalPayment();
      return;
    }

    // For reject, use the existing flow
    try {
      const token = localStorage.getItem('token');
      const endpoint = `/api/withdrawals/${selectedWithdrawal._id}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rejectionReason, notes })
      });

      if (response.ok) {
        setShowActionModal(false);
        setSelectedWithdrawal(null);
        setNotes('');
        setRejectionReason('');
        fetchWithdrawals();
        dispatch(showNotification('Withdrawal rejected successfully'));
      } else {
        const data = await response.json();
        dispatch(showNotification(data.error || 'Failed to reject withdrawal', 'error'));
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      dispatch(showNotification('Network error. Please try again.', 'error'));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' },
      approved: { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' },
      rejected: { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)' }
    };
    return badges[status] || { backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.50 0.05 280)' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42677D]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Withdrawal Management</h2>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className="px-4 py-2 rounded-lg font-medium transition"
              style={
                filter === status
                  ? {
                      backgroundColor: 'oklch(0.45 0.15 290)',
                      color: 'oklch(0.98 0.01 280)'
                    }
                  : {
                      backgroundColor: 'oklch(0.18 0.05 285)',
                      borderColor: 'oklch(0.25 0.05 285)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: 'oklch(0.98 0.01 280)'
                    }
              }
              onMouseEnter={(e) => {
                if (filter !== status) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== status) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                }
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Table */}
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
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Solana Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Total Earned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Total Withdrawn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Requested
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Processed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  No withdrawal requests found
                </td>
              </tr>
            ) : (
              withdrawals.map((withdrawal) => (
                <tr 
                  key={withdrawal._id}
                  style={{
                    backgroundColor: 'oklch(0.18 0.05 285)',
                    borderBottom: '1px solid oklch(0.25 0.05 285)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(withdrawal)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {withdrawal.user?.firstName} {withdrawal.user?.lastName}
                      </div>
                      <div className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                        {withdrawal.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {withdrawal.solanaAddress || withdrawal.user?.solanaAddress 
                        ? shortAddress(withdrawal.solanaAddress || withdrawal.user?.solanaAddress)
                        : 'Not provided'}
                    </div>
                    {withdrawal.paymentSignature && (
                      <div className="text-xs mt-1" style={{ color: 'oklch(0.70 0.15 150)' }}>
                        Paid: {shortAddress(withdrawal.paymentSignature)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {withdrawal.amount.toFixed(6)} SOL
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {(withdrawal.totalEarned || 0).toFixed(6)} SOL
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {(withdrawal.totalWithdrawn || 0).toFixed(6)} SOL
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" style={getStatusBadge(withdrawal.status)}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    {formatDate(withdrawal.requestedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    {withdrawal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(withdrawal);
                          }}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.70 0.15 150)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(withdrawal);
                          }}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'oklch(0.55 0.22 25)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.60 0.22 25)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.22 25)'; }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status !== 'pending' && (
                      <div style={{ color: 'oklch(0.50 0.05 280)' }}>
                        {withdrawal.processedBy?.firstName} {withdrawal.processedBy?.lastName}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
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
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
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
      )}

      {/* Action Modal */}
      {showActionModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Withdrawal Request
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">User</div>
              <div className="font-medium">
                {selectedWithdrawal.user?.firstName} {selectedWithdrawal.user?.lastName}
              </div>
              <div className="text-sm text-gray-500">{selectedWithdrawal.user?.email}</div>
            </div>

            {actionType === 'approve' && paymentDetails && (
              <>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-semibold text-blue-900 mb-2">Payment Details</div>
                  <div className="text-sm text-blue-800 mb-1">
                    <span className="font-medium">Amount:</span> {paymentDetails.amountSOL.toFixed(6)} SOL
                  </div>
                  <div className="text-sm text-blue-800">
                    <span className="font-medium">Recipient:</span>
                    <div className="font-mono text-xs mt-1 break-all">
                      {paymentDetails.solanaAddress}
                    </div>
                  </div>
                </div>
                
                {!solanaConnected && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm text-yellow-800">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Please connect your Solana wallet to process this payment.
                    </div>
                  </div>
                )}
              </>
            )}

            {actionType === 'reject' && (
              <>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Solana Address</div>
                  <div className="font-mono text-sm text-gray-900">
                    {selectedWithdrawal.solanaAddress || selectedWithdrawal.user?.solanaAddress
                      ? shortAddress(selectedWithdrawal.solanaAddress || selectedWithdrawal.user?.solanaAddress)
                      : 'Not provided'}
                  </div>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Amount</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedWithdrawal.amount.toFixed(6)} SOL
                  </div>
                </div>
              </>
            )}

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42677D] focus:border-transparent"
                  rows="3"
                  required
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42677D] focus:border-transparent"
                rows="3"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedWithdrawal(null);
                  setNotes('');
                  setRejectionReason('');
                  setPaymentDetails(null);
                }}
                disabled={isProcessingPayment}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={
                  isProcessingPayment ||
                  (actionType === 'reject' && !rejectionReason) ||
                  (actionType === 'approve' && !solanaConnected)
                }
                className={`flex-1 py-2 px-4 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  actionType === 'approve' ? 'Pay & Approve' : 'Reject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Detail Modal */}
      {showDetailModal && detailWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Withdrawal Details</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailWithdrawal(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* User Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">User Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Name</div>
                    <div className="text-sm font-medium text-gray-900">
                      {detailWithdrawal.user?.firstName} {detailWithdrawal.user?.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="text-sm text-gray-900">{detailWithdrawal.user?.email}</div>
                  </div>
                </div>
              </div>

              {/* Withdrawal Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Withdrawal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Amount</div>
                    <div className="text-lg font-bold text-gray-900">
                      {detailWithdrawal.amount.toFixed(6)} SOL
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" style={getStatusBadge(detailWithdrawal.status)}>
                      {detailWithdrawal.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Earned</div>
                    <div className="text-sm font-semibold text-green-700">
                      {(detailWithdrawal.totalEarned || 0).toFixed(6)} SOL
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Withdrawn</div>
                    <div className="text-sm font-semibold text-blue-700">
                      {(detailWithdrawal.totalWithdrawn || 0).toFixed(6)} SOL
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Requested At</div>
                    <div className="text-sm text-gray-900">
                      {formatDate(detailWithdrawal.requestedAt)}
                    </div>
                  </div>
                  {detailWithdrawal.processedAt && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Processed At</div>
                      <div className="text-sm text-gray-900">
                        {formatDate(detailWithdrawal.processedAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Solana Address */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Solana Address</h4>
                <div className="font-mono text-sm text-gray-900 bg-white p-2 rounded border">
                  {detailWithdrawal.solanaAddress || detailWithdrawal.user?.solanaAddress
                    ? shortAddress(detailWithdrawal.solanaAddress || detailWithdrawal.user?.solanaAddress)
                    : 'Not provided'}
                </div>
              </div>

              {/* Payment Information */}
              {detailWithdrawal.paymentSignature && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Payment Information</h4>
                  <div>
                    <div className="text-xs text-green-700 mb-1">Transaction Signature</div>
                    <div className="font-mono text-sm text-green-900 break-all bg-white p-2 rounded border border-green-200">
                      {detailWithdrawal.paymentSignature}
                    </div>
                    <a
                      href={`https://solscan.io/tx/${detailWithdrawal.paymentSignature}${solanaNetwork === 'devnet' ? '?cluster=devnet' : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 hover:text-green-900 mt-2 inline-block"
                    >
                      View on Solscan <i className="fas fa-external-link-alt ml-1"></i>
                    </a>
                  </div>
                </div>
              )}

              {/* Rejection Information */}
              {detailWithdrawal.status === 'rejected' && detailWithdrawal.rejectionReason && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</h4>
                  <div className="text-sm text-red-800">{detailWithdrawal.rejectionReason}</div>
                </div>
              )}

              {/* Notes */}
              {detailWithdrawal.notes && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Notes</h4>
                  <div className="text-sm text-blue-800">{detailWithdrawal.notes}</div>
                </div>
              )}

              {/* Processed By */}
              {detailWithdrawal.processedBy && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Processed By</h4>
                  <div className="text-sm text-gray-900">
                    {detailWithdrawal.processedBy.firstName} {detailWithdrawal.processedBy.lastName}
                  </div>
                  {detailWithdrawal.processedBy.email && (
                    <div className="text-xs text-gray-500 mt-1">
                      {detailWithdrawal.processedBy.email}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setDetailWithdrawal(null);
                }}
                className="px-6 py-2 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

