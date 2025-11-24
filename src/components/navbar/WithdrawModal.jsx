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
        <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}
            >
              <i className="fas fa-check text-2xl" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Request Submitted</h2>
            <p className="mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>
              Your withdrawal request has been submitted and is pending approval.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 text-white rounded transition"
              style={{
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
              }}
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
      <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="transition"
            style={{ color: 'oklch(0.65 0.05 280)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.98 0.01 280)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
          <div className="text-sm mb-1" style={{ color: 'oklch(0.65 0.05 280)' }}>Available Balance</div>
          <div className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>{balance.toFixed(6)} SOL</div>
          {balance < minWithdrawAmount && (
            <div className="text-xs text-orange-600 mt-1">
              Minimum withdrawal: {minWithdrawAmount} SOL
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Solana Wallet Address *
            </label>
              <input
                type="text"
                value={solanaAddress}
                onChange={(e) => setSolanaAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 font-mono text-sm"
                style={{
                  borderColor: 'oklch(0.25 0.05 285)',
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter your Solana wallet address (44 characters)"
                required
              />
            <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
              Your withdrawal will be sent to this address
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
              Withdrawal Amount (Minimum: {minWithdrawAmount} SOL)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'oklch(0.65 0.05 280)' }}>SOL</span>
              <input
                type="number"
                step="0.000001"
                min={minWithdrawAmount}
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-20 py-2 border rounded-md focus:ring-2"
                style={{
                  borderColor: 'oklch(0.25 0.05 285)',
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder={`${minWithdrawAmount}`}
                required
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm rounded transition-colors"
                style={{ color: 'oklch(0.45 0.15 290)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Max
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 border rounded-md text-sm" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.1)', borderColor: 'oklch(0.55 0.22 25 / 0.3)' }}>
              <p style={{ color: 'oklch(0.55 0.22 25)' }}>{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border rounded-md transition"
              style={{
                borderColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount || !solanaAddress || parseFloat(amount) < minWithdrawAmount || parseFloat(amount) > balance || solanaAddress.trim().length !== 44}
              className="flex-1 py-2 px-4 text-white rounded-md transition disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                }
              }}
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

