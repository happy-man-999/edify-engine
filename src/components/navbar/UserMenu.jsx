import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWalletWithRedirects } from '../../hooks/useWalletWithRedirects';
import { useWalletModal } from '../../hooks/useWalletModal';
import { shortAddress } from '../../utils/format';
import { walletLogos } from '../walletLogos';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const { user, signout, isAuthenticated } = useAuth();
  const { publicKey, wallet, connected, disconnect } = useWalletWithRedirects();
  const { openWalletModal } = useWalletModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
    <div className="relative" ref={menuRef}>
      <div
        className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {isAuthenticated && user?.avatar ? (
          <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <i className="fas fa-user"></i>
        )}
      </div>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          {/* User Profile Section */}
          {isAuthenticated ? (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-user text-gray-600"></i>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
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
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-user text-gray-600"></i>
                </div>
                <div className="text-sm text-gray-500 mb-3">Not signed in</div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      window.location.href = '/signin';
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 bg-[#42677D] text-white rounded hover:bg-[#355263] transition text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/signup';
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 border border-[#42677D] text-[#42677D] rounded hover:bg-[#42677D] hover:text-white transition text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Section */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Wallet</h3>
              {connected && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Connected
                </span>
              )}
            </div>
            
            {connected ? (
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300">
                  {wallet && wallet.adapter 
                    ? <img src={walletLogos[wallet.adapter.name]} alt={wallet.adapter.name} className="w-5 h-5" /> 
                    : <i className="fas fa-wallet text-gray-600"></i>
                  }
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {wallet && wallet.adapter && wallet.adapter.name || 'Wallet'}
                  </div>
                  <div className="text-xs text-gray-500 break-all">
                    {shortAddress(publicKey)}
                  </div>
                </div>
                <button
                  onClick={handleWalletDisconnect}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">No wallet connected</div>
                <button
                  onClick={handleConnectWallet}
                  className="w-full py-2 bg-[#42677D] text-white rounded hover:bg-[#355263] transition text-sm"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>

          {/* Account Actions - Only show if authenticated */}
          {isAuthenticated && (
            <div className="space-y-2 mb-4">
              <button
                className="w-full py-2 px-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
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
                className="w-full py-2 px-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                onClick={() => {
                  // Navigate to orders/purchases
                  navigate('/store?tab=My%20Purchases', { replace: true });
                  setMenuOpen(false);
                }}
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                My Purchases
              </button>
            </div>
          )}

          {/* Sign Out Button - Only show if authenticated */}
          {isAuthenticated && (
            <div className="pt-3 border-t border-gray-200">
              <button
                className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                onClick={handleSignout}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 