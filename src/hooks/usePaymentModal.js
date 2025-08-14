import { useSelector, useDispatch } from 'react-redux';
import { openPaymentModal, closePaymentModal, resolvePayment, rejectPayment } from '../store/uiSlice';

export const usePaymentModal = () => {
  const dispatch = useDispatch();
  const { isOpen, paymentData } = useSelector(state => state.ui.paymentModal);

  const openModal = (data) => {
    return new Promise((resolve, reject) => {
      dispatch(openPaymentModal({
        ...data,
        resolveRef: resolve,
        rejectRef: reject
      }));
    });
  };

  const closeModal = () => {
    dispatch(closePaymentModal());
  };

  const resolveModal = (result) => {
    dispatch(resolvePayment(result));
  };

  const rejectModal = (error) => {
    dispatch(rejectPayment(error));
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