import React, { useState, useEffect } from 'react';

export default function WithdrawModal({ balance, onClose, open = false }) {
  const [amount, setAmount] = useState('');
  const [solanaAddress, setSolanaAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [minWithdrawAmount, setMinWithdrawAmount] = useState(0.33333); // Default fallback

  // Fetch minimum withdrawal amount from settings
  useEffect(() => {
    const fetchMinWithdrawAmount = async () => {
      try {
        const response = await fetch('/api/admin/payment-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.settings?.requiredWithdrawAmount !== undefined) {
            setMinWithdrawAmount(data.settings.requiredWithdrawAmount);
          }
        }
      } catch (error) {
        console.error('Error fetching minimum withdrawal amount:', error);
        // Keep default value
      }
    };
    fetchMinWithdrawAmount();
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setAmount('');
      setSolanaAddress('');
      setError('');
      setSuccess(false);
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const withdrawAmount = parseFloat(amount);
    
    if (!amount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    if (withdrawAmount < minWithdrawAmount) {
      setError(`Minimum withdrawal amount is ${minWithdrawAmount} SOL`);
      setLoading(false);
      return;
    }

    if (withdrawAmount > balance) {
      setError('Amount cannot exceed your balance');
      setLoading(false);
      return;
    }

    if (!solanaAddress || solanaAddress.trim() === '') {
      setError('Please enter your Solana wallet address');
      setLoading(false);
      return;
    }

    // Basic validation for Solana address (44 characters)
    if (solanaAddress.trim().length !== 44) {
      setError('Invalid Solana address. Must be 44 characters long.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: withdrawAmount,
          solanaAddress: solanaAddress.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit withdrawal request');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Withdrawal error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(balance.toFixed(6));
  };

  if (!open) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
            <p className="text-gray-600 mb-4">
              Your withdrawal request has been submitted and is pending approval.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#42677D] text-white rounded hover:bg-[#355263] transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-gray-900">{balance.toFixed(6)} SOL</div>
          {balance < minWithdrawAmount && (
            <div className="text-xs text-orange-600 mt-1">
              Minimum withdrawal: {minWithdrawAmount} SOL
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solana Wallet Address *
            </label>
              <input
                type="text"
                value={solanaAddress}
                onChange={(e) => setSolanaAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42677D] focus:border-transparent font-mono text-sm"
                placeholder="Enter your Solana wallet address (44 characters)"
                required
              />
            <p className="text-xs text-gray-500 mt-1">
              Your withdrawal will be sent to this address
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount (Minimum: {minWithdrawAmount} SOL)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">SOL</span>
              <input
                type="number"
                step="0.000001"
                min={minWithdrawAmount}
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42677D] focus:border-transparent"
                placeholder={`${minWithdrawAmount}`}
                required
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm text-[#42677D] hover:bg-gray-100 rounded"
              >
                Max
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount || !solanaAddress || parseFloat(amount) < minWithdrawAmount || parseFloat(amount) > balance || solanaAddress.trim().length !== 44}
              className="flex-1 py-2 px-4 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </span>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <i className="fas fa-info-circle mr-1"></i>
            Your withdrawal request will be reviewed and processed by an administrator. This may take 1-3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}

