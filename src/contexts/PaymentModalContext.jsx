import React, { createContext, useContext } from 'react';

const PaymentModalContext = createContext();

export const usePaymentModalContext = () => {
  const context = useContext(PaymentModalContext);
  if (!context) {
    throw new Error('usePaymentModalContext must be used within a PaymentModalProvider');
  }
  return context;
};

export const PaymentModalProvider = ({ children, openPaymentModal }) => {
  return (
    <PaymentModalContext.Provider value={{ openPaymentModal }}>
      {children}
    </PaymentModalContext.Provider>
  );
}; 