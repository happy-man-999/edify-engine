import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';
import { useErrorModal } from './useErrorModal';

export const usePaymentSuccess = () => {
  const dispatch = useDispatch();
  const { showError } = useErrorModal();

  // Handle Stripe payment success
  const handleStripePaymentSuccess = async (sessionId) => {
    try {
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
        console.log('Payment success result:', result);
        
        // Handle different payment types
        if (result.itemType === 'new-world') {
          // Show domain information for new-world payments
          if (result.domain) {
            dispatch(showNotification(`New world created successfully! Your domain: ${result.domain}`));
          } else {
            dispatch(showNotification(`New world created successfully!`));
          }
          console.log('New world creation payment successful');
        } else if (result.itemType === 'item-purchase') {
          // Handle item purchase success
          dispatch(showNotification(`Item purchased successfully! ${result.itemName || ''}`));
          console.log('Item purchase payment successful:', result.itemId);
        } else if (result.itemType === 'premium-plan') {
          // Handle premium plan success
          dispatch(showNotification(`Premium plan activated successfully!`));
          console.log('Premium plan payment successful');
        } else {
          // Generic success message
          dispatch(showNotification(`Payment successful! ${result.message || ''}`));
        }
        
        return result;
      } else {
        const error = await response.json();
        showError(`Payment success handling failed: ${error.error}`);
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      showError('Payment successful, but confirmation failed');
      throw error;
    }
  };

  return {
    handleStripePaymentSuccess
  };
}; 