import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useLoadingSpinner } from './useLoadingSpinner';
import { useErrorModal } from './useErrorModal';
import { useWalletWithRedirects } from './useWalletWithRedirects';
import { useCurrency } from './useCurrency';
import { createCheckoutSession, redirectToCheckout, initializeStripe } from '../utils/stripe';
import { sendSOLWithReference } from '../utils/paySolana';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeInitialized, setStripeInitialized] = useState(false);
  const { user } = useAuth();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { showError } = useErrorModal();
  const { connected: solanaConnected, publicKey: solanaPublicKey } = useWalletWithRedirects();
  const { convertUsdToSol } = useCurrency();
  
  // Initialize Stripe when hook is first used
  useEffect(() => {
    const initStripe = async () => {
      try {
        const success = await initializeStripe();
        setStripeInitialized(success);
        if (success) {
          console.log('Stripe initialized successfully');
        } else {
          console.log('Stripe initialization failed');
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        setStripeInitialized(false);
      }
    };

    initStripe();
  }, []);

  const processPayment = async ({ 
    amount, 
    paymentMethod, 
    itemName = '',
    itemId = null,
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to make payments');
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    setIsProcessing(true);
    showSpinner('Processing payment...');

    try {
      let result;

      if (paymentMethod === 'stripe') {
        // Stripe only supports USD
        result = await processStripePayment(amount, itemId, itemName);
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
      
      throw error;
    }
  };

  const processStripePayment = async (amount, itemId, itemName) => {
    try {
      // Check if Stripe is initialized
      if (!stripeInitialized) {
        throw new Error('Stripe is not initialized. Please try again.');
      }

      // Stripe only supports USD and expects amount in cents
      const amountInCents = Math.round(amount * 100);
      console.log('Stripe payment - Amount conversion:', { original: amount, inCents: amountInCents });
      
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
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  };

  const processSolanaPayment = async (amount, itemId) => {
    try {
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

      // Use the owner's Solana address from environment or fallback
      const recipient = import.meta.env.VITE_OWNER_SOLNANA_ADDRESS || '11111111111111111111111111111111';

      // Generate a unique order ID similar to your reference code
      const payInfo = `${user._id || user.id}-${itemId}`;
      
      // Send SOL payment
      const signature = await sendSOLWithReference(recipient, amount, payInfo);

      return {
        signature,
        token: signature,
        success: true
      };
    } catch (error) {
      console.error('Solana payment error:', error);
      throw new Error(`Solana payment failed: ${error.message}`);
    }
  };



  return {
    // State
    isProcessing,
    stripeInitialized,
    
    // Actions
    processPayment,
    
    // Individual payment methods (for advanced usage)
    processStripePayment,
    processSolanaPayment
  };
}; 