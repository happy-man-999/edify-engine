import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWalletWithRedirects } from '../../hooks/useWalletWithRedirects';
import { useWalletModal } from '../../hooks/useWalletModal';
import { shortAddress } from '../../utils/format';
import { walletLogos } from '../walletLogos';
import { useNavigate } from 'react-router-dom';
import { useWithdrawModal } from '../../hooks/useWithdrawModal';

export default function UserMenu() {
  const { user, signout, isAuthenticated } = useAuth();
  const { publicKey, wallet, connected, disconnect } = useWalletWithRedirects();
  const { openWalletModal } = useWalletModal();
  const { openWithdrawModal } = useWithdrawModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'withdrawals'
  const [balance, setBalance] = useState(0);
  const [minWithdrawAmount, setMinWithdrawAmount] = useState(0.33333); // Default fallback
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const openCalendlyModal = () => {
    // Open Calendly in a new tab
    window.open(import.meta.env.VITE_CALENDLY_URL, '_blank', 'noopener,noreferrer');
    setMenuOpen(false);
  };

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/withdrawals/balance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

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

  // Listen for balance update events (e.g., after purchase)
  useEffect(() => {
    const handleBalanceUpdate = () => {
      if (isAuthenticated) {
        fetchBalance();
      }
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate);
    };
  }, [isAuthenticated]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignout = async () => {
    await signout();
    setMenuOpen(false);
  };

  const handleWalletDisconnect = () => {
    disconnect();
    setMenuOpen(false);
  };

  const handleConnectWallet = () => {
    openWalletModal();
    setMenuOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <div
          className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-colors text-gray-300"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285)',
            borderColor: 'oklch(0.25 0.05 285 / 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
          }}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {isAuthenticated && user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <i className="fas fa-user"></i>
          )}
        </div>
        {menuOpen && (
          <div 
            className="absolute right-0 mt-2 w-96 border rounded-lg shadow-lg z-50 p-4 max-h-[600px] overflow-y-auto"
            style={{
              backgroundColor: 'oklch(0.18 0.05 285)',
              borderColor: 'oklch(0.25 0.05 285)'
            }}
          >
          {/* Tabs */}
          {isAuthenticated && (
            <div className="flex space-x-2 mb-4 border-b" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'border-b-2'
                    : ''
                }`}
                style={activeTab === 'profile' ? {
                  color: 'oklch(0.45 0.15 290)',
                  borderColor: 'oklch(0.45 0.15 290)'
                } : {
                  color: 'oklch(0.65 0.05 280)'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'profile') {
                    e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'profile') {
                    e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                  }
                }}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'withdrawals'
                    ? 'border-b-2'
                    : ''
                }`}
                style={activeTab === 'withdrawals' ? {
                  color: 'oklch(0.45 0.15 290)',
                  borderColor: 'oklch(0.45 0.15 290)'
                } : {
                  color: 'oklch(0.65 0.05 280)'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'withdrawals') {
                    e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'withdrawals') {
                    e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                  }
                }}
              >
                Withdrawals
              </button>
            </div>
          )}

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <ProfileContent 
              key={activeTab} // Force remount when tab changes to refresh data
              user={user}
              isAuthenticated={isAuthenticated}
              connected={connected}
              wallet={wallet}
              publicKey={publicKey}
              balance={balance}
              onBalanceUpdate={fetchBalance}
              onWalletDisconnect={handleWalletDisconnect}
              onConnectWallet={handleConnectWallet}
              onSignout={handleSignout}
              openWithdrawModal={openWithdrawModal}
              openCalendlyModal={openCalendlyModal}
              navigate={navigate}
              setMenuOpen={setMenuOpen}
              minWithdrawAmount={minWithdrawAmount}
            />
          )}

          {/* Withdrawals Tab Content */}
          {activeTab === 'withdrawals' && isAuthenticated && (
            <WithdrawalsHistory
              minWithdrawAmount={minWithdrawAmount}
              key={activeTab} // Force remount when tab changes to refresh data
              onWithdrawClick={() => {
                openWithdrawModal(balance, () => {
                  fetchBalance();
                  // Trigger refresh of withdrawals list via custom event
                  window.dispatchEvent(new CustomEvent('withdrawalSubmitted'));
                });
                setMenuOpen(false);
              }}
              balance={balance}
              onBalanceUpdate={fetchBalance}
            />
          )}
          </div>
        )}
      </div>
    </>
  );
}

// Profile Content Component
function ProfileContent({ 
  user, 
  isAuthenticated, 
  connected, 
  wallet, 
  publicKey, 
  balance, 
  onBalanceUpdate,
  onWalletDisconnect,
  onConnectWallet,
  onSignout,
  openWithdrawModal,
  openCalendlyModal,
  navigate,
  setMenuOpen,
  minWithdrawAmount = 0.33333
}) {
  useEffect(() => {
    if (isAuthenticated) {
      onBalanceUpdate(); // Fetch balance when component mounts
    }
  }, [isAuthenticated, onBalanceUpdate]);

  return (
    <>
      {/* User Profile Section */}
      {isAuthenticated ? (
        <div className="mb-4 pb-4 border-b" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
          <div className="flex items-center space-x-3 mb-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}
              >
                <i className="fas fa-user" style={{ color: 'oklch(0.65 0.05 280)' }}></i>
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                {user?.email}
              </div>
              {user?.googleId && (
                <div className="text-xs text-blue-600 flex items-center mt-1">
                  <i className="fab fa-google mr-1"></i>
                  Google Account
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 pb-4 border-b" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
          <div className="text-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}
            >
              <i className="fas fa-user" style={{ color: 'oklch(0.65 0.05 280)' }}></i>
            </div>
            <div className="text-sm mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>Not signed in</div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  window.location.href = '/signin';
                  setMenuOpen(false);
                }}
                className="w-full py-2 text-white rounded transition text-sm"
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
                Sign In
              </button>
              <button
                onClick={() => {
                  window.location.href = '/signup';
                  setMenuOpen(false);
                }}
                className="w-full py-2 border rounded transition text-sm"
                style={{
                  borderColor: 'oklch(0.45 0.15 290)',
                  color: 'oklch(0.45 0.15 290)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'oklch(0.45 0.15 290)';
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Section */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Wallet</h3>
          {connected && (
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)', color: 'oklch(0.50 0.18 260)' }}
            >
              Connected
            </span>
          )}
        </div>
        
        {connected ? (
          <div className="flex items-center space-x-3">
            <span 
              className="w-8 h-8 flex items-center justify-center rounded-full border"
              style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)' }}
            >
              {wallet && wallet.adapter 
                ? <img src={walletLogos[wallet.adapter.name]} alt={wallet.adapter.name} className="w-5 h-5" /> 
                : <i className="fas fa-wallet" style={{ color: 'oklch(0.65 0.05 280)' }}></i>
              }
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {wallet && wallet.adapter && wallet.adapter.name || 'Wallet'}
              </div>
              <div className="text-xs break-all" style={{ color: 'oklch(0.65 0.05 280)' }}>
                {shortAddress(publicKey)}
              </div>
            </div>
            <button
              onClick={onWalletDisconnect}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-sm mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>No wallet connected</div>
            <button
              onClick={onConnectWallet}
              className="w-full py-2 text-white rounded transition text-sm"
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
              Connect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Earnings Balance Section - Only show if authenticated */}
      {isAuthenticated && (
        <div className="mb-4 pb-4 border-b" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Earnings Balance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {balance.toFixed(6)} SOL
              </div>
              <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>
                {balance >= minWithdrawAmount ? 'Available to withdraw' : `Minimum ${minWithdrawAmount} SOL required to withdraw`}
              </div>
            </div>
            <button
              onClick={() => {
                openWithdrawModal(balance, () => {
                  onBalanceUpdate(); // Refresh balance after withdrawal
                });
                setMenuOpen(false);
              }}
              disabled={balance < minWithdrawAmount}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                balance >= minWithdrawAmount
                  ? 'text-white'
                  : 'cursor-not-allowed'
              }`}
              style={balance >= minWithdrawAmount ? {
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
              } : {
                backgroundColor: 'oklch(0.25 0.04 285)',
                color: 'oklch(0.65 0.05 280)'
              }}
              onMouseEnter={(e) => {
                if (balance >= minWithdrawAmount) {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                }
              }}
              onMouseLeave={(e) => {
                if (balance >= minWithdrawAmount) {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                }
              }}
            >
              Withdraw
            </button>
          </div>
        </div>
      )}

      {/* Account Actions - Only show if authenticated */}
      {isAuthenticated && (
        <div className="space-y-2 mb-4">
          <button
            className="w-full py-2 px-3 text-left text-sm rounded transition-colors"
            style={{ color: 'oklch(0.98 0.01 280)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onClick={() => {
              // Navigate to profile settings
              window.location.href = 'http://billing.stripe.com/p/login/6oU14nfrg2Y1aza8317Re00';
              setMenuOpen(false);
            }}
          >
            <i className="fas fa-cog mr-2"></i>
            Manage Account
          </button>
          <button
            className="w-full py-2 px-3 text-left text-sm rounded transition-colors"
            style={{ color: 'oklch(0.98 0.01 280)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onClick={() => {
              // Navigate to orders/purchases
              navigate('/store?tab=My%20Purchases', { replace: true });
              setMenuOpen(false);
            }}
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            My Purchases
          </button>
          {user?.plan === 'premium' && (
            <button
              className="w-full py-2 px-3 text-left text-sm rounded transition-colors"
            style={{ color: 'oklch(0.98 0.01 280)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              onClick={openCalendlyModal}
            >
              <i className="fas fa-calendar-alt mr-2"></i>
              Schedule Meeting
            </button>
          )}
        </div>
      )}

      {/* Sign Out Button - Only show if authenticated */}
      {isAuthenticated && (
        <div className="pt-3 border-t" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
          <button
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
            onClick={onSignout}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}

// Withdrawals History Component
function WithdrawalsHistory({ onWithdrawClick, balance, onBalanceUpdate, minWithdrawAmount = 0.33333 }) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchWithdrawals();
    
    // Listen for withdrawal submission events to refresh the list
    const handleWithdrawalSubmitted = () => {
      fetchWithdrawals();
    };
    
    window.addEventListener('withdrawalSubmitted', handleWithdrawalSubmitted);
    return () => {
      window.removeEventListener('withdrawalSubmitted', handleWithdrawalSubmitted);
    };
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/withdrawals/my-withdrawals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals || []);
        onBalanceUpdate(); // Refresh balance
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWithdrawals = filter === 'all' 
    ? withdrawals 
    : withdrawals.filter(w => w.status === filter);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || { backgroundColor: 'oklch(0.18 0.05 285)', color: 'oklch(0.98 0.01 280)' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* Balance and Withdraw Button */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Earnings Balance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {balance.toFixed(6)} SOL
            </div>
            <div className="text-xs text-gray-500">
              {balance >= minWithdrawAmount ? 'Available to withdraw' : `Minimum ${minWithdrawAmount} SOL required to withdraw`}
            </div>
          </div>
          <button
            onClick={onWithdrawClick}
            disabled={balance < minWithdrawAmount}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              balance >= minWithdrawAmount
                ? 'bg-[#42677D] text-white hover:bg-[#355263]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 text-xs rounded transition ${
              filter === status
                ? 'text-white'
                : ''
            }`}
            style={filter === status ? {
              backgroundColor: 'oklch(0.45 0.15 290)'
            } : {
              backgroundColor: 'oklch(0.18 0.05 285)',
              color: 'oklch(0.98 0.01 280)'
            }}
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

      {/* Withdrawals List */}
      {loading ? (
        <div className="text-center py-8">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
            style={{ borderColor: 'oklch(0.45 0.15 290)' }}
          ></div>
        </div>
      ) : filteredWithdrawals.length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
          No {filter !== 'all' ? filter : ''} withdrawals found
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredWithdrawals.map((withdrawal) => (
            <div key={withdrawal._id} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(withdrawal.status)}`}>
                      {withdrawal.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${withdrawal.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Requested: {formatDate(withdrawal.requestedAt)}
                  </div>
                  {withdrawal.processedAt && (
                    <div className="text-xs text-gray-500">
                      {withdrawal.status === 'approved' ? 'Approved' : 'Rejected'}: {formatDate(withdrawal.processedAt)}
                    </div>
                  )}
                  {withdrawal.paymentSignature && (
                    <div className="text-xs text-green-600 mt-1 font-mono">
                      TX: {withdrawal.paymentSignature.substring(0, 8)}...
                    </div>
                  )}
                  {withdrawal.rejectionReason && (
                    <div className="text-xs text-red-600 mt-1">
                      Reason: {withdrawal.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 