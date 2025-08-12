import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorModal: { open: false, message: '' },
  yesNoModal: {
    open: false,
    message: '',
    modalId: '',
  },
  notification: null,
  loadingSpinner: {
    isVisible: false,
    message: 'Loading...',
  },
  walletModal: {
    isOpen: false,
  },
  currency: 'USD',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showErrorModal(state, action) { state.errorModal = { open: true, message: action.payload }; },
    closeErrorModal(state) { state.errorModal = { open: false, message: '' }; },
    showYesNoModal(state, action) {
      state.yesNoModal = {
        open: true,
        message: action.payload.message,
        modalId: action.payload.modalId,
      };
    },
    closeYesNoModal(state) {
      state.yesNoModal = { open: false, message: '', modalId: '' };
    },
    showNotification(state, action) { state.notification = action.payload; },
    clearNotification(state) { state.notification = null; },
    showLoadingSpinner(state, action) { 
      state.loadingSpinner = { 
        isVisible: true, 
        message: action.payload || 'Loading...' 
      }; 
    },
    hideLoadingSpinner(state) { 
      state.loadingSpinner = { 
        isVisible: false, 
        message: 'Loading...' 
      }; 
    },
    showWalletModal(state) { 
      state.walletModal = { 
        isOpen: true 
      }; 
    },
    hideWalletModal(state) { 
      state.walletModal = { 
        isOpen: false 
      }; 
    },
    changeCurrency(state, action) {
      state.currency = action.payload;
    },
  },
});

export const {
  showErrorModal,
  closeErrorModal,
  showYesNoModal,
  closeYesNoModal,
  showNotification,
  clearNotification,
  showLoadingSpinner,
  hideLoadingSpinner,
  showWalletModal,
  hideWalletModal,
  changeCurrency,
} = uiSlice.actions;

export default uiSlice.reducer;
