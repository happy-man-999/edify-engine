import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { openWalletModal } from '../../store/uiSlice';
import { wallets } from '../WalletModal';
import { shortAddress } from '../../utils/format';

import { disconnected } from '../../store/phantomSlice';

export default function StoreAction() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading, isError } = useBalance({
    address: address,
  });
  const { 
    address: phantomAddress,
    isConnected: isPhantomConnected, 
    balance: phantomBalance, 
    isBalanceLoading: isPhantomLoading 
  } = useSelector(state => state.phantom);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        //setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const getWalletIcon = () => {
    let wallet = wallets.find(wallet => wallet.key.toLowerCase() === connector?.name.toLowerCase())
    if (!wallet && isPhantomConnected) {
      wallet = wallets.find(wallet => wallet.key.toLowerCase() === 'phantom')
    }
    return wallet ? <img src={wallet.img} alt={wallet.name} className="w-6 h-6" /> : <i className="fas fa-wallet"></i>;
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="relative hidden md:block">
        <input type="text" placeholder="Search store..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-[#42677D] focus:ring-[#42677D] w-64" />
        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
      <button id="cartButton" className="relative">
        <i className="fas fa-shopping-cart text-xl text-gray-600 hover:text-[#42677D]"></i>
        <span className="absolute -top-2 -right-2 bg-[#42677D] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
      </button>
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i className="fas fa-user"></i>
        </div>
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-50 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
          >
            {(isConnected || isPhantomConnected) ? (
              <>
                <div className="mb-2 flex items-center justify-center space-x-2">
                  {/* Wallet avatar */}
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300">
                    {getWalletIcon()}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-700">
                      {connector?.name || isPhantomConnected && 'Phantom' || 'Wallet'}
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {isPhantomConnected ? shortAddress(phantomAddress) : shortAddress(address)}
                    </div>
                  </div>
                  {/*<div className="font-semibold text-gray-700 ml-2">
                    {isPhantomConnected
                      ? (isPhantomLoading ? 'Loading...' : phantomBalance?.toFixed(2) + ' SOL')
                      : (isLoading ? 'Loading...' : isError ? 'Error' : `${balance?.formatted} ${balance?.symbol}`)
                    }
                  </div>*/}
                </div>
                <button
                  className="w-full py-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => {
                    if (isPhantomConnected) {
                      dispatch(disconnected());
                    }
                    if (connector) {
                      disconnect();
                    }
                    setMenuOpen(false);
                  }}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <div className="text-gray-600 mb-2">Not connected</div>
                <button
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => {
                    dispatch(openWalletModal());
                    setMenuOpen(false);
                  }}
                >
                  Connect Wallet
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}