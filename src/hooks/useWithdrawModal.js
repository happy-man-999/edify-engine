import { useState, useEffect, useCallback } from 'react';

let withdrawModalState = {
  isOpen: false,
  balance: 0,
  onCloseCallback: null
};

const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener({ ...withdrawModalState }));
};

export const useWithdrawModal = () => {
  const [state, setState] = useState(withdrawModalState);

  const updateState = useCallback((newState) => {
    withdrawModalState = { ...withdrawModalState, ...newState };
    notifyListeners();
  }, []);

  useEffect(() => {
    const listener = (newState) => setState(newState);
    listeners.add(listener);
    setState(withdrawModalState); // Set initial state
    return () => listeners.delete(listener);
  }, []);

  const openWithdrawModal = useCallback((balance, onClose) => {
    updateState({
      isOpen: true,
      balance,
      onCloseCallback: onClose
    });
  }, [updateState]);

  const closeWithdrawModal = useCallback(() => {
    if (withdrawModalState.onCloseCallback) {
      withdrawModalState.onCloseCallback();
    }
    updateState({
      isOpen: false,
      balance: 0,
      onCloseCallback: null
    });
  }, [updateState]);

  return {
    isOpen: state.isOpen,
    balance: state.balance,
    openWithdrawModal,
    closeWithdrawModal
  };
};

