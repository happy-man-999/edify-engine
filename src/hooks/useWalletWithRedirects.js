import { useWallet } from '@solana/wallet-adapter-react';
import { checkAndRedirectPhantom, checkAndRedirectCoinbase } from '../utils/walletRedirects';
import { useErrorModal } from './useErrorModal';

export const useWalletWithRedirects = () => {
  const { wallets, wallet, select, connect, connecting, connected, disconnect, publicKey } = useWallet();
  const { showError } = useErrorModal();

  const connectWithRedirect = async (walletName) => {
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