import { useState, useRef } from 'react';

export const usePaymentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const resolveRef = useRef(null);
  const rejectRef = useRef(null);

  const openPaymentModal = (data) => {
    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
      setPaymentData(data);
      setIsOpen(true);
    });
  };

  const closePaymentModal = () => {
    setIsOpen(false);
    setPaymentData(null);
    // Reject any pending promise if modal is closed without completion
    if (rejectRef.current) {
      rejectRef.current(new Error('Payment modal was closed'));
      resolveRef.current = null;
      rejectRef.current = null;
    }
  };

  const resolvePayment = (result) => {
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
      rejectRef.current = null;
    }
    closePaymentModal();
  };

  const rejectPayment = (error) => {
    if (rejectRef.current) {
      rejectRef.current(error);
      resolveRef.current = null;
      rejectRef.current = null;
    }
    closePaymentModal();
  };

  return {
    isOpen,
    paymentData,
    openPaymentModal,
    closePaymentModal,
    resolvePayment,
    rejectPayment
  };
}; 