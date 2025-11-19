import { useDispatch } from 'react-redux';
import { showNotification, openDomainModal } from '../store/uiSlice';
import { checkAuth } from '../store/authSlice';
import { useErrorModal } from './useErrorModal';
import { useLoadingSpinner } from './useLoadingSpinner';
import { useWebhook } from './useWebhook';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useUserDroplets } from './useUserDroplets';

export const usePaymentSuccess = () => {
  const dispatch = useDispatch();
  const { showError } = useErrorModal();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { refreshUserDroplets } = useUserDroplets();
  
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
  const { lastEvent: webhookEvent } = useWebhook(userId, true);
  
  // Function to handle file downloads
  const handleDownload = useCallback(async (downloadUrl, fileName) => {
    try {
      // Show loading notification
      dispatch(showNotification(`Starting download for ${fileName || 'item'}...`));
      
      // Fetch the file as a blob to handle CORS properly
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'download';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      // Show success notification
      dispatch(showNotification(`Download completed for ${fileName || 'item'}`));
    } catch (error) {
      console.error('Error downloading file:', error);
      dispatch(showNotification('Download failed. Please try again.'));
    }
  }, [dispatch]);
  
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
  
  // Memoize the webhook event handler to prevent infinite loops
  const handleWebhookEvent = useCallback((event) => {
    if (event.type === 'new-world-created') {
      const { sessionId, signature, domain, status } = event.data;
      
      if (status === 'completed') {
        // Update processing state - use sessionId for Stripe or signature for Solana
        const paymentId = sessionId || signature;
        setProcessingPayments(prev => {
          const newMap = new Map(prev);
          newMap.delete(paymentId);
          return newMap;
        });
        
        // Hide spinner and show success
        hideSpinnerRef.current();
        dispatchRef.current(showNotification(`New world created successfully! Your domain: ${domain}`));
      }
    } else if (event.type === 'new-world-creation-failed') {
      const { sessionId, signature, error } = event.data;
      
      // Update processing state - use sessionId for Stripe or signature for Solana
      const paymentId = sessionId || signature;
      setProcessingPayments(prev => {
        const newMap = new Map(prev);
        newMap.delete(paymentId);
        return newMap;
      });
      
      // Hide spinner and show error
      hideSpinnerRef.current();
      showErrorRef.current(`New world creation failed: ${error}`);
    }
  }, []);

  // Handle webhook events
  useEffect(() => {
    if (webhookEvent) {
      handleWebhookEvent(webhookEvent);
    }
  }, [webhookEvent, handleWebhookEvent]);

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
          
          // Handle download if downloadUrl is available
          if (result.downloadUrl) {
            handleDownload(result.downloadUrl, result.itemName || 'item');
          }
        } else if (result.itemType === 'cart-purchase') {
          console.log(result);
          // Handle item purchase success
          dispatch(showNotification(`Cart purchased successfully!`));
        } else if (result.itemType === 'start-plan' || result.itemType === 'growth-plan' || result.itemType === 'studio-plan' || result.itemType === 'enterprise-plan' || result.itemType === 'basic-plan' || result.itemType === 'premium-plan') {
          // Handle plan purchase/update success
          const planName = result.planName || (result.itemType === 'start-plan' || result.itemType === 'basic-plan' ? 'Starter' :
                                               result.itemType === 'growth-plan' || result.itemType === 'premium-plan' ? 'Growth' :
                                               result.itemType === 'studio-plan' ? 'Studio' :
                                               result.itemType === 'enterprise-plan' ? 'Enterprise' : 'Plan');
          
          // Show appropriate notification based on upgrade/downgrade
          if (result.isUpgrade) {
            dispatch(showNotification(`Plan upgraded to ${planName} successfully!`));
          } else if (result.isDowngrade) {
            dispatch(showNotification(`Plan downgraded to ${planName} successfully!`));
          } else if (result.isDirectSubscriptionUpdate) {
            dispatch(showNotification(`${planName} plan updated successfully!`));
          } else {
            dispatch(showNotification(`${planName} plan activated successfully!`));
          }
          
          // Refresh user data to get updated plan information
          const token = localStorage.getItem('token');
          if (token) {
            dispatch(checkAuth(token));
          }
        } else if (result.itemType === 'custom-domain') {
          // Handle custom domain success
          dispatch(showNotification(`Upgraded your world to use a custom domain successfully!`));
          
          refreshUserDroplets();
          
          // Open domain modal for the upgraded droplet
          if (result.droplet.dropletId) {
            dispatch(openDomainModal(result.droplet.dropletId));
          }
        } else {
          // Generic success message
          dispatch(showNotification(`Payment successful! ${result.message || ''}`));
        }
        
        return result;
      } else {
        const error = await response.json();
        
        // Handle specific world creation limit error
        if (error.limitReached) {
          showError(`World creation limit reached: ${error.message}`);
        } else {
          showError(`Payment success handling failed: ${error.error}`);
        }
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
  const handleSolanaPaymentSuccess = async (signature, metadata = {}) => {
    try {
      showSpinner('Confirming payment...');
      
      const response = await fetch('/api/solana/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          signature: signature,
          metadata
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
          
          // Handle download if downloadUrl is available
          if (result.downloadUrl) {
            handleDownload(result.downloadUrl, result.itemName || 'item');
          }
        } else if (result.itemType === 'cart-purchase') {
          // Handle item purchase success
          dispatch(showNotification(`Cart purchased successfully!`));
        } else {
          // Generic success message
          dispatch(showNotification(`Payment successful! Signature: ${signature.slice(0, 8)}...`));
        }
        
        return result;
      } else {
        const error = await response.json();
        
        // Handle specific world creation limit error
        if (error.limitReached) {
          showError(`World creation limit reached: ${error.message}`);
        } else {
          showError(`Payment success handling failed: ${error.error}`);
        }
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