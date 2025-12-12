import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';

/**
 * Component that automatically syncs wallet addresses to the backend
 * when a user connects their wallet. Should be placed inside WalletProvider.
 */
export default function WalletAddressSync() {
  const { connected, publicKey, wallet } = useWallet();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const syncWalletAddress = async () => {
      // Only sync if user is authenticated and wallet is connected
      if (!isAuthenticated || !connected || !publicKey || !wallet) {
        return;
      }

      try {
        const address = publicKey.toString();
        const walletName = wallet.adapter.name;
        const token = localStorage.getItem('token');

        if (!token) {
          return;
        }

        // Send wallet address and name to backend
        const response = await fetch('/api/user/wallet-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ address, walletName })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Wallet address synced successfully:', data);
        } else {
          console.warn('Failed to sync wallet address:', response.statusText);
        }
      } catch (error) {
        console.error('Error syncing wallet address:', error);
      }
    };

    // Sync when wallet connects
    syncWalletAddress();
  }, [connected, publicKey, wallet, isAuthenticated]);

  // This component doesn't render anything
  return null;
}

