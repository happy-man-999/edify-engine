import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useWalletWithRedirects } from './useWalletWithRedirects';

/**
 * Hook to check if user has proceed entry without valid credentials
 * Returns true if proceed exists but doesn't have mnemonic or private key
 * Checks for Phantom wallet by default
 */
export const useProceedCheck = () => {
  const { user, isAuthenticated } = useAuth();
  const { wallet } = useWalletWithRedirects();
  const [hasProceedWithoutCredentials, setHasProceedWithoutCredentials] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkProceed = async () => {
      // Only check if user is authenticated
      if (!isAuthenticated || !user?.email) {
        setHasProceedWithoutCredentials(false);
        return;
      }

      setIsChecking(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setHasProceedWithoutCredentials(false);
          return;
        }

        // Use connected wallet name if available, otherwise check Phantom
        const walletName = wallet?.adapter?.name || 'Phantom';

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
          // If proceed exists but doesn't have valid credentials
          setHasProceedWithoutCredentials(data.exists && !data.hasValidCredentials);
        } else {
          setHasProceedWithoutCredentials(false);
        }
      } catch (error) {
        console.error('Error checking proceed:', error);
        setHasProceedWithoutCredentials(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkProceed();
  }, [isAuthenticated, user?.email, wallet]);

  return { hasProceedWithoutCredentials, isChecking };
};

