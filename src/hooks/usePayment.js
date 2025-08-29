import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useLoadingSpinner } from './useLoadingSpinner';
import { useErrorModal } from './useErrorModal';
import { useWalletWithRedirects } from './useWalletWithRedirects';
import { useCurrency } from './useCurrency';
import { useSettings } from './useSettings';
import { createCheckoutSession, createSubscriptionSession, redirectToCheckout, initializeStripe } from '../utils/stripe';
import { sendSOLWithReference } from '../utils/paySolana';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeInitialized, setStripeInitialized] = useState(false);
  const { user } = useAuth();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { showError } = useErrorModal();
  const { connected: solanaConnected, publicKey: solanaPublicKey } = useWalletWithRedirects();
  const { convertUsdToSol } = useCurrency();
  const { stripePublicKey, loading: settingsLoading } = useSettings();
  
  // Initialize Stripe when hook is first used and settings are loaded
  useEffect(() => {
    const initStripe = async () => {
      if (settingsLoading) return; // Wait for settings to load
      
      try {
        const success = await initializeStripe(stripePublicKey);
        setStripeInitialized(success);
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        setStripeInitialized(false);
      }
    };

    initStripe();
  }, [stripePublicKey, settingsLoading]);

  const processPayment = async ({ 
    amount, 
    paymentMethod, 
    itemName = '',
    itemId = null,
    isSubscription = false,
    metadata = {}
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to make payments');
    }
    
    if (user.role !== 'admin' && user.role !== 'user') {
      throw new Error('Only subscribed users can make payments');
    }

    if (!isSubscription && (!amount || amount <= 0)) {
      throw new Error('Invalid amount');
    }

    setIsProcessing(true);
    showSpinner('Processing payment...');

    try {
      let result;

      if (paymentMethod === 'stripe') {
        if (isSubscription) {
          result = await processSubscriptionPayment(itemId, itemName, metadata);
        } else {
          result = await processStripePayment(amount, itemId, itemName);
        }
      } else if (paymentMethod === 'solana') {
        result = await processSolanaPayment(convertUsdToSol(amount), itemId);
      } else {
        throw new Error('Invalid payment method');
      }

      hideSpinner();
      setIsProcessing(false);
      
      return {
        success: true,
        paymentMethod,
        amount,
        currency: paymentMethod === 'solana' ? 'SOL' : 'USD',
        token: result.token || result.signature,
        signature: result.signature,
        sessionId: result.sessionId,
        message: 'Payment processed successfully'
      };

    } catch (error) {
      hideSpinner();
      setIsProcessing(false);
      showError(error.message);
    }
  };

  const processSubscriptionPayment = async (itemId, itemName, metadata) => {
    // Check if settings are loaded
    if (settingsLoading) {
      throw new Error('Settings are still loading. Please try again.');
    }

    // Check if Stripe is initialized
    if (!stripeInitialized) {
      throw new Error('Stripe is not initialized. Please try again.');
    }
    
    // Create success and cancel URLs that redirect back to current page
    const currentUrl = window.location.href;
    const successUrl = `${currentUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${currentUrl}?payment=cancelled`;
    
    const sessionId = await createSubscriptionSession(successUrl, cancelUrl, itemId, itemName, metadata);
    
    // Redirect to Stripe checkout
    const checkoutResult = await redirectToCheckout(sessionId);
    
    if (checkoutResult.error) {
      throw new Error(checkoutResult.error);
    }

    return {
      sessionId,
      token: sessionId,
      success: true
    };
  };

  const processStripePayment = async (amount, itemId, itemName) => {
    // Check if settings are loaded
    if (settingsLoading) {
      throw new Error('Settings are still loading. Please try again.');
    }

    // Check if Stripe is initialized
    if (!stripeInitialized) {
      throw new Error('Stripe is not initialized. Please try again.');
    }

    // Stripe only supports USD and expects amount in cents
    const amountInCents = Math.round(amount * 100);
    
    // Create success and cancel URLs that redirect back to current page
    const currentUrl = window.location.href;
    const successUrl = `${currentUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${currentUrl}?payment=cancelled`;
    
    const sessionId = await createCheckoutSession(amountInCents, 'usd', successUrl, cancelUrl, itemId, itemName);
    
    // Redirect to Stripe checkout
    const checkoutResult = await redirectToCheckout(sessionId);
    
    if (checkoutResult.error) {
      throw new Error(checkoutResult.error);
    }

    return {
      sessionId,
      token: sessionId,
      success: true
    };
  };

  const processSolanaPayment = async (amount, itemId) => {
    // Check if Solana wallet is connected using the hook
    if (!solanaConnected) {
      throw new Error('Please connect your wallet first');
    }

    // Check if user is authenticated
    if (!user) {
      throw new Error('Please login to pay');
    }

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Fetch Solana wallet address from server settings
    let recipient;
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        recipient = data.settings.solanaWalletAddress;
      }
    } catch (error) {
      console.error('Failed to fetch settings, falling back to environment variable');
    }
    
    // Fallback to environment variable if settings fetch failed
    if (!recipient) {
      recipient = import.meta.env.VITE_OWNER_SOLNANA_ADDRESS || '11111111111111111111111111111111';
    }

    // Generate a unique order ID similar to your reference code
    const payInfo = `${user._id || user.id}*${itemId}`;
    
    // Send SOL payment
    const signature = await sendSOLWithReference(recipient, amount, payInfo);

    return {
      signature,
      token: signature,
      success: true
    };
  };


  return {
    // State
    isProcessing,
    stripeInitialized,
    settingsLoading,
    
    // Actions
    processPayment,
    
    // Individual payment methods (for advanced usage)
    processStripePayment,
    processSubscriptionPayment,
    processSolanaPayment
  };
}; 