import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';
import { useErrorModal } from './useErrorModal';
import { useLoadingSpinner } from './useLoadingSpinner';
import { useWebhook, useSolanaWebhook } from './useWebhook';
import { useState, useEffect, useCallback, useRef } from 'react';

export const usePaymentSuccess = () => {
  const dispatch = useDispatch();
  const { showError } = useErrorModal();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  
  // State for tracking payment processing
  const [processingPayments, setProcessingPayments] = useState(new Map());
  
  // Get current user ID from localStorage
  const getCurrentUserId = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT token to get user ID (simplified approach)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }, []);

  const userId = getCurrentUserId();
  
  // Connect to webhooks for real-time updates
  const { lastEvent: stripeWebhookEvent } = useWebhook(userId, true);
  const { lastEvent: solanaWebhookEvent } = useSolanaWebhook(userId, true);
  
  // Use refs to store stable function references
  const hideSpinnerRef = useRef(hideSpinner);
  const showErrorRef = useRef(showError);
  const dispatchRef = useRef(dispatch);
  
  // Update refs when dependencies change
  useEffect(() => {
    hideSpinnerRef.current = hideSpinner;
    showErrorRef.current = showError;
    dispatchRef.current = dispatch;
  }, [hideSpinner, showError, dispatch]);
  
  // Memoize the webhook event handlers to prevent infinite loops
  const handleStripeWebhookEvent = useCallback((event) => {
    if (event.type === 'new-world-created') {
      const { sessionId, domain, status } = event.data;
      
      if (status === 'completed') {
        // Update processing state
        setProcessingPayments(prev => {
          const newMap = new Map(prev);
          newMap.delete(sessionId);
          return newMap;
        });
        
        // Hide spinner and show success
        hideSpinnerRef.current();
        dispatchRef.current(showNotification(`New world created successfully! Your domain: ${domain}`));
      }
    } else if (event.type === 'new-world-creation-failed') {
      const { sessionId, error } = event.data;
      
      // Update processing state
      setProcessingPayments(prev => {
        const newMap = new Map(prev);
        newMap.delete(sessionId);
        return newMap;
      });
      
      // Hide spinner and show error
      hideSpinnerRef.current();
      showErrorRef.current(`New world creation failed: ${error}`);
    }
  }, []);
  
  const handleSolanaWebhookEvent = useCallback((event) => {
    if (event.type === 'new-world-created') {
      const { signature, domain, status } = event.data;
      
      if (status === 'completed') {
        // Update processing state
        setProcessingPayments(prev => {
          const newMap = new Map(prev);
          newMap.delete(signature);
          return newMap;
        });
        
        // Hide spinner and show success
        hideSpinnerRef.current();
        dispatchRef.current(showNotification(`New world created successfully! Your domain: ${domain}`));
      }
    } else if (event.type === 'new-world-creation-failed') {
      const { signature, error } = event.data;
      
      // Update processing state
        setProcessingPayments(prev => {
          const newMap = new Map(prev);
          newMap.delete(signature);
          return newMap;
        });
      
      // Hide spinner and show error
      hideSpinnerRef.current();
      showErrorRef.current(`New world creation failed: ${error}`);
    }
  }, []);

  // Handle webhook events
  useEffect(() => {
    if (stripeWebhookEvent) {
      handleStripeWebhookEvent(stripeWebhookEvent);
    }
  }, [stripeWebhookEvent, handleStripeWebhookEvent]);
  
  useEffect(() => {
    if (solanaWebhookEvent) {
      handleSolanaWebhookEvent(solanaWebhookEvent);
    }
  }, [solanaWebhookEvent, handleSolanaWebhookEvent]);

  // Handle Stripe payment success
  const handleStripePaymentSuccess = async (sessionId) => {
    try {
      showSpinner('Confirming payment...');
      
      const response = await fetch('/api/stripe/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sessionId: sessionId,
          amount: 0 // Amount will be retrieved from Stripe session
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Handle different payment types
        if (result.itemType === 'new-world' && result.processing) {
          // Show processing state for new world creation
          showSpinner('Creating your new world... This may take a few minutes.');
          
          // Track this payment as processing
          setProcessingPayments(prev => {
            const newMap = new Map(prev);
            newMap.set(sessionId, {
              type: 'new-world',
              status: 'processing',
              timestamp: Date.now()
            });
            return newMap;
          });
          
          dispatch(showNotification(`Payment confirmed! Your new world is being created. You'll be notified when it's ready.`));
          
        } else if (result.itemType === 'new-world') {
          // Show domain information for new-world payments (if already completed)
          if (result.domain) {
            dispatch(showNotification(`New world created successfully! Your domain: ${result.domain}`));
          } else {
            dispatch(showNotification(`New world created successfully!`));
          }
        } else if (result.itemType === 'item-purchase') {
          // Handle item purchase success
          dispatch(showNotification(`Item purchased successfully! ${result.itemName || ''}`));
        } else if (result.itemType === 'basic-plan') {
          // Handle basic plan success
          dispatch(showNotification(`Basic plan activated successfully!`));
        } else if (result.itemType === 'advanced-plan') {
          // Handle advanced plan success
          dispatch(showNotification(`Advanced plan activated successfully!`));
        } else {
          // Generic success message
          dispatch(showNotification(`Payment successful! ${result.message || ''}`));
        }
        
        return result;
      } else {
        const error = await response.json();
        showError(`Payment success handling failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      showError('Payment successful, but confirmation failed');
    } finally {
      // Only hide spinner if not processing a new world
      if (!processingPayments.has(sessionId)) {
        hideSpinner();
      }
    }
  };

  // Handle Solana payment success
  const handleSolanaPaymentSuccess = async (signature) => {
    try {
      showSpinner('Confirming payment...');
      
      const response = await fetch('/api/solana/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          signature: signature
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Handle different payment types
        if (result.itemType === 'new-world' && result.processing) {
          // Show processing state for new world creation
          showSpinner('Creating your new world... This may take a few minutes.');
          
          // Track this payment as processing
          setProcessingPayments(prev => {
            const newMap = new Map(prev);
            newMap.set(signature, {
              type: 'new-world',
              status: 'processing',
              timestamp: Date.now()
            });
            return newMap;
          });
          
          dispatch(showNotification(`Payment confirmed! Your new world is being created. You'll be notified when it's ready.`));
          
        } else if (result.itemType === 'new-world') {
          // Show domain information for new-world payments (if already completed)
          if (result.domain) {
            dispatch(showNotification(`New world created successfully! Your domain: ${result.domain}`));
          } else {
            dispatch(showNotification(`New world created successfully!`));
          }
        } else if (result.itemType === 'item-purchase') {
          // Handle item purchase success
          dispatch(showNotification(`Item purchased successfully! ${result.itemName || ''}`));
        } else {
          // Generic success message
          dispatch(showNotification(`Payment successful! Signature: ${signature.slice(0, 8)}...`));
        }
        
        return result;
      } else {
        const error = await response.json();
        showError(`Payment success handling failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error handling Solana payment success:', error);
      showError('Payment successful, but confirmation failed');
    } finally {
      // Only hide spinner if not processing a new world
      if (!processingPayments.has(signature)) {
        hideSpinner();
      }
    }
  };

  // Function to check if a payment is still processing
  const isPaymentProcessing = useCallback((identifier) => {
    return processingPayments.has(identifier);
  }, [processingPayments]);

  // Function to get processing status
  const getProcessingStatus = useCallback((identifier) => {
    return processingPayments.get(identifier);
  }, [processingPayments]);

  // Function to clear processing state
  const clearProcessingState = useCallback((identifier) => {
    setProcessingPayments(prev => {
      const newMap = new Map(prev);
      newMap.delete(identifier);
      return newMap;
    });
  }, []);

  return {
    handleStripePaymentSuccess,
    handleSolanaPaymentSuccess,
    isPaymentProcessing,
    getProcessingStatus,
    clearProcessingState,
    processingPayments
  };
}; 