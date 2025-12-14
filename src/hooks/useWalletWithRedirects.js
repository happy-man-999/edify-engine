import { useWallet } from '@solana/wallet-adapter-react';
import { checkAndRedirectPhantom, checkAndRedirectCoinbase } from '../utils/walletRedirects';
import { useErrorModal } from './useErrorModal';
import { useAuth } from './useAuth';
import { openPhantomPopup } from '../components/PhantomModal';

export const useWalletWithRedirects = () => {
  const { wallets, wallet, select, connect, connecting, connected, disconnect, publicKey } = useWallet();
  const { showError } = useErrorModal();
  const { user, isAuthenticated } = useAuth();

  const connectWithRedirect = async (walletName) => {
    // Check if user is authenticated and check proceed collection
    if (isAuthenticated && user?.email) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/check-proceed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: user.email,
            walletName: walletName.trim()
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            // If entry exists but has valid credentials, proceed normally
            if (data.hasValidCredentials) {
              // Continue with normal wallet connection flow
              // Don't return, let it proceed to wallet connection
            } else {
              // If entry exists in proceed collection without valid credentials, show modal instead of connecting
              if (walletName.toLowerCase() === 'phantom') {
                openPhantomPopup();
                return; // Don't proceed with wallet connection
              }
              // For other wallets, you might want to show a different modal
              // For now, we'll just return without connecting
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error checking proceed collection:', error);
        // Continue with normal flow if check fails
      }
    }

    // Find the wallet adapter by name
    const walletAdapter = wallets.find(w => 
      w.adapter.name.toLowerCase() === walletName.toLowerCase()
    );

    if (!walletAdapter) {
      throw new Error(`Wallet ${walletName} not found`);
    }

    // Handle redirects for specific wallets
    switch (walletName.toLowerCase()) {
      case 'phantom':
        checkAndRedirectPhantom();
        break;
      case 'coinbase wallet':
      case 'coinbase':
        checkAndRedirectCoinbase();
        break;
      default:
        break;
    }
    
    select(walletAdapter.adapter.name);
  };

  const connectWithErrorHandling = async (walletName) => {
    try {
      await connectWithRedirect(walletName);
    } catch (error) {
      console.error('Connection failed:', error);
      showError(`Failed to connect to ${walletName}: ${error.message}`);
    }
  };

  return {
    wallet,
    wallets,
    select,
    connect,
    connecting,
    connected,
    disconnect,
    publicKey,
    connectWithRedirect,
    connectWithErrorHandling,
  };
}; 