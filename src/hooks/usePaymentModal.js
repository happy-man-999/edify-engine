import { useSelector, useDispatch } from 'react-redux';
import { openPaymentModal, closePaymentModal } from '../store/uiSlice';

export const usePaymentModal = () => {
  const dispatch = useDispatch();
  const { isOpen, paymentData } = useSelector(state => state.ui.paymentModal);

  const openModal = (data) => {
    return new Promise((resolve, reject) => {
      // Generate a unique ID for this modal
      const modalId = Date.now().toString();
      
      // Create a custom event listener for this modal
      const handleModalResponse = (event) => {
        if (event.detail.modalId === modalId) {
          window.removeEventListener('paymentModalResponse', handleModalResponse);
          
          if (event.detail.success) {
            resolve(event.detail.result);
          } else {
            reject(event.detail.error);
          }
        }
      };
      
      window.addEventListener('paymentModalResponse', handleModalResponse);
      
      // Only store serializable data in Redux
      const serializableData = { ...data, modalId };
      dispatch(openPaymentModal(serializableData));
    });
  };

  const closeModal = () => {
    dispatch(closePaymentModal());
  };

  const resolveModal = (result) => {
    // Dispatch custom event with success result
    if (paymentData && paymentData.modalId) {
      window.dispatchEvent(new CustomEvent('paymentModalResponse', {
        detail: { 
          modalId: paymentData.modalId, 
          success: true, 
          result 
        }
      }));
    }
    // Close the modal after resolving
    dispatch(closePaymentModal());
  };

  const rejectModal = (error) => {
    // Dispatch custom event with error result
    if (paymentData && paymentData.modalId) {
      window.dispatchEvent(new CustomEvent('paymentModalResponse', {
        detail: { 
          modalId: paymentData.modalId, 
          success: false, 
          error 
        }
      }));
    }
    // Close the modal after rejecting
    dispatch(closePaymentModal());
  };

  return {
    isOpen,
    paymentData,
    openPaymentModal: openModal,
    closePaymentModal: closeModal,
    resolvePayment: resolveModal,
    rejectPayment: rejectModal
  };
}; 