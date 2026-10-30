import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorModal: { open: false, message: '' },
  yesNoModal: {
    open: false,
    message: '',
    modalId: '',
  },
  snapshotNameModal: {
    open: false,
    modalId: '',
    defaultName: '',
  },
  snapshotSelectionModal: {
    open: false,
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
  paymentModal: {
    isOpen: false,
    paymentData: null,
  },
  domainModal: {
    isOpen: false,
    dropletId: null,
  },
  editorModal: {
    isOpen: false,
    domain: null,
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
    showSnapshotNameModal(state, action) {
      state.snapshotNameModal = {
        open: true,
        modalId: action.payload.modalId,
        defaultName: action.payload.defaultName || '',
      };
    },
    closeSnapshotNameModal(state) {
      state.snapshotNameModal = { open: false, modalId: '', defaultName: '' };
    },
    showSnapshotSelectionModal(state, action) {
      state.snapshotSelectionModal = {
        open: true,
        modalId: action.payload.modalId,
      };
    },
    closeSnapshotSelectionModal(state) {
      state.snapshotSelectionModal = { open: false, modalId: '' };
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
    openPaymentModal(state, action) {
      state.paymentModal = {
        isOpen: true,
        paymentData: action.payload,
      };
    },
    closePaymentModal(state, action) {
      state.paymentModal = {
        isOpen: false,
        paymentData: null,
      };
    },
    openDomainModal(state, action) {
      state.domainModal = {
        isOpen: true,
        dropletId: action.payload,
      };
    },
    hideDomainModal(state) {
      state.domainModal = {
        isOpen: false,
        dropletId: null,
      };
    },
    openEditorModal(state, action) {
      state.editorModal = {
        isOpen: true,
        domain: action.payload,
      };
    },
    closeEditorModal(state) {
      state.editorModal = {
        isOpen: false,
        domain: null,
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
  showSnapshotNameModal,
  closeSnapshotNameModal,
  showSnapshotSelectionModal,
  closeSnapshotSelectionModal,
  showNotification,
  clearNotification,
  showLoadingSpinner,
  hideLoadingSpinner,
  showWalletModal,
  hideWalletModal,
  openPaymentModal,
  closePaymentModal,
  openDomainModal,
  hideDomainModal,
  openEditorModal,
  closeEditorModal,
  changeCurrency,
} = uiSlice.actions;

export default uiSlice.reducer;
