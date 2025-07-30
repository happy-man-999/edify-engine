import { useState, useRef } from 'react';
import { shortAddress } from '../../utils/format';
import { walletLogos } from '../walletLogos'
import { useWalletModal } from '../../hooks/useWalletModal';
import { useWalletWithRedirects } from '../../hooks/useWalletWithRedirects';

export default function StoreAction() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { publicKey, wallet, connected, disconnect } = useWalletWithRedirects();

  const { openWalletModal } = useWalletModal();

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
            {connected ? (
              <>
                <div className="mb-2 flex items-center justify-center space-x-2">
                  {/* Wallet avatar */}
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300">
                    {wallet && wallet.adapter 
                      ? <img src={walletLogos[wallet.adapter.name]} /> 
                      : <i className="fas fa-wallet text-gray-600"></i>
                    }
                  </span>
                  <div>
                    <div className="font-semibold text-gray-700">
                      {wallet && wallet.adapter && wallet.adapter.name || 'Wallet'}
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {shortAddress(publicKey)}
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => {
                    disconnect();
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
                  className="w-full py-2 bg-[#42677D] text-white rounded hover:bg-[#355263] transition"
                  onClick={() => {
                    openWalletModal();
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