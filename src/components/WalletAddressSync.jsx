import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';

/**
 * Component that automatically syncs wallet addresses to the backend
 * when a user connects their wallet or when user signs in with wallet already connected.
 * Should be placed inside WalletProvider.
 */
export default function WalletAddressSync() {
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const lastSyncedRef = useRef(null); // Track last synced address to avoid duplicate syncs
  const proceedCheckedRef = useRef(false); // Track if we've checked proceed for this session

  // Reset proceed check ref when wallet disconnects
  useEffect(() => {
    if (!connected) {
      proceedCheckedRef.current = false;
    }
  }, [connected]);

  // Check proceed and disconnect wallet if needed (runs when user signs in)
  useEffect(() => {
    const checkProceedAndDisconnect = async () => {
      // Only check if user is authenticated and wallet is connected
      if (!isAuthenticated || !connected || !wallet || !user?.email) {
        return;
      }

      // Skip if we already checked proceed for this connection
      if (proceedCheckedRef.current) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const walletName = wallet.adapter.name;

        // Check proceed collection
        const response = await fetch('/api/user/check-proceed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: user.email,
            walletName: walletName
          })
        });

        if (response.ok) {
          const data = await response.json();
          // If proceed exists but doesn't have valid credentials, disconnect wallet
          if (data.exists && !data.hasValidCredentials) {
            console.log('Proceed exists without valid credentials, disconnecting wallet');
            disconnect();
          }
          // Mark as checked regardless of outcome
          proceedCheckedRef.current = true;
        }
      } catch (error) {
        console.error('Error checking proceed collection:', error);
      }
    };

    // Check proceed when user signs in (if wallet is already connected)
    checkProceedAndDisconnect();
  }, [isAuthenticated, connected, wallet, user, disconnect]);

  useEffect(() => {
    const syncWalletAddress = async () => {
      // Only sync if user is authenticated and wallet is connected
      if (!isAuthenticated || !connected || !publicKey || !wallet) {
        return;
      }

      const address = publicKey.toString();
      const walletName = wallet.adapter.name;
      
      // Create a unique key for this sync attempt
      const syncKey = `${address}-${walletName}-${isAuthenticated}`;
      
      // Skip if we already synced this exact combination
      if (lastSyncedRef.current === syncKey) {
        return;
      }

      try {
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
          // Mark this combination as synced
          lastSyncedRef.current = syncKey;
        } else {
          console.warn('Failed to sync wallet address:', response.statusText);
        }
      } catch (error) {
        console.error('Error syncing wallet address:', error);
      }
    };

    // Sync when wallet connects OR when user signs in (if wallet is already connected)
    syncWalletAddress();
  }, [connected, publicKey, wallet, isAuthenticated]);

  // This component doesn't render anything
  return null;
}

