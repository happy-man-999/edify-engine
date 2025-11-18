import React, { useState, useEffect } from 'react';

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

  const handleApprove = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setActionType('approve');
    setShowActionModal(true);
  };

  const handleReject = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setActionType('reject');
    setShowActionModal(true);
  };

  const submitAction = async () => {
    if (!selectedWithdrawal) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = actionType === 'approve' 
        ? `/api/withdrawals/${selectedWithdrawal._id}/approve`
        : `/api/withdrawals/${selectedWithdrawal._id}/reject`;
      
      const body = actionType === 'approve'
        ? { notes }
        : { rejectionReason, notes };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setShowActionModal(false);
        setSelectedWithdrawal(null);
        setNotes('');
        setRejectionReason('');
        fetchWithdrawals();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to process withdrawal');
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Network error. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Withdrawal Management</h2>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-[#42677D] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solana Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Processed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No withdrawal requests found
                </td>
              </tr>
            ) : (
              withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {withdrawal.user?.firstName} {withdrawal.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {withdrawal.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-gray-700 break-all max-w-xs">
                      {withdrawal.solanaAddress || withdrawal.user?.solanaAddress || 'Not provided'}
                    </div>
                    {withdrawal.paymentSignature && (
                      <div className="text-xs text-green-600 mt-1">
                        Paid: {withdrawal.paymentSignature.substring(0, 8)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${withdrawal.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(withdrawal.status)}`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(withdrawal.requestedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {withdrawal.processedAt ? formatDate(withdrawal.processedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {withdrawal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(withdrawal)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status !== 'pending' && (
                      <div className="text-gray-400">
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
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Solana Address</div>
              <div className="font-mono text-sm text-gray-900 break-all">
                {selectedWithdrawal.solanaAddress || selectedWithdrawal.user?.solanaAddress || 'Not provided'}
              </div>
              {!selectedWithdrawal.solanaAddress && !selectedWithdrawal.user?.solanaAddress && actionType === 'approve' && (
                <div className="text-xs text-red-600 mt-1">
                  Cannot approve: No Solana address linked
                </div>
              )}
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ${selectedWithdrawal.amount.toFixed(2)}
              </div>
            </div>

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
                }}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={
                  (actionType === 'reject' && !rejectionReason) ||
                  (actionType === 'approve' && !selectedWithdrawal.solanaAddress && !selectedWithdrawal.user?.solanaAddress)
                }
                className={`flex-1 py-2 px-4 rounded-lg text-white transition ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:bg-gray-300 disabled:cursor-not-allowed`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

