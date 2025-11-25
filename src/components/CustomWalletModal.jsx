import React, { useState, useEffect } from 'react';
import { useWalletWithRedirects } from '../hooks/useWalletWithRedirects';
import { walletLogos } from './walletLogos';
import { useLoadingSpinner } from '../hooks/useLoadingSpinner';
import { useWalletModal } from '../hooks/useWalletModal';

export default function CustomWalletModal() {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const { wallets, connectWithErrorHandling, connecting } = useWalletWithRedirects();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { isOpen, closeWalletModal } = useWalletModal();

  useEffect(() => {
    if (connecting) {
      showSpinner('Connecting...');
    } else {
      hideSpinner();
    }
  }, [connecting]);

  const handleWalletSelect = async (wallet) => {
    await connectWithErrorHandling(wallet.adapter.name);
    closeWalletModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div 
          className="p-6"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Connect Wallet</h2>
            <button
              onClick={closeWalletModal}
              className="text-white/80 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-white/90 text-sm mt-2">
            Choose your preferred wallet to connect
          </p>
        </div>

        {/* Wallet List */}
        <div className="p-6">
          <div className="space-y-3">
            {wallets.map((wallet) => {
              const logo = walletLogos[wallet.adapter.name] || '';
              const isSelected = selectedWallet?.adapter.name === wallet.adapter.name;
              
              return (
                <button
                  key={wallet.adapter.name}
                  onClick={() => handleWalletSelect(wallet)}
                  disabled={connecting}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4
                    ${isSelected 
                      ? 'border-[#42677D] bg-[#42677D]/5 shadow-lg' 
                      : 'border-gray-200 hover:border-[#42677D]/50 hover:bg-gray-50'
                    }
                    ${connecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {/* Wallet Logo */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    {logo ? (
                      <img 
                        src={logo} 
                        alt={wallet.adapter.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-8 h-8 bg-[#42677D] rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ display: logo ? 'none' : 'flex' }}>
                      {wallet.adapter.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Wallet Info */}
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">
                      {wallet.adapter.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {wallet.adapter.name === 'Phantom' && 'Popular Solana wallet'}
                      {wallet.adapter.name === 'Coinbase Wallet' && 'Secure crypto wallet'}
                      {wallet.adapter.name === 'MetaMask' && 'Ethereum wallet'}
                      {wallet.adapter.name === 'WalletConnect' && 'Multi-chain wallet'}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'border-[#42677D] bg-[#42677D]' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By connecting your wallet, you agree to our{' '}
              <a href="#" className="text-[#42677D] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#42677D] hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 