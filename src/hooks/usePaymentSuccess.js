import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';
import { useErrorModal } from './useErrorModal';
import { useLoadingSpinner } from './useLoadingSpinner';

export const usePaymentSuccess = () => {
  const dispatch = useDispatch();
  const { showError } = useErrorModal();
  const { showSpinner, hideSpinner } = useLoadingSpinner();

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
        dispatch(showNotification(`Payment successful! ${result.message}`));
        
        // Handle different payment types
        if (result.itemType === 'new-world') {
          // Show domain information for new-world payments
          if (result.domain) {
            dispatch(showNotification(`New world created successfully! Your domain: ${result.domain}`));
          } else {
            dispatch(showNotification(`New world created successfully!`));
          }
        } else if (result.itemType === 'item-purchase') {
          // Handle item purchase success
          dispatch(showNotification(`Item purchased successfully! ${result.itemName || ''}`));
        } else if (result.itemType === 'premium-plan') {
          // Handle premium plan success
          dispatch(showNotification(`Premium plan activated successfully!`));
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
      hideSpinner();
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
        if (result.itemType === 'new-world') {
          // Show domain information for new-world payments
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
      hideSpinner();
    }
  };

  return {
    handleStripePaymentSuccess,
    handleSolanaPaymentSuccess
  };
}; 