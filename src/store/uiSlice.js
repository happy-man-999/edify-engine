import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  walletModalOpen: false,
  errorModal: { open: false, message: '' },
  yesNoModal: {
    open: false,
    message: '',
    resolve: null,
    reject: null,
  },
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openWalletModal(state) { state.walletModalOpen = true; },
    closeWalletModal(state) { state.walletModalOpen = false; },
    showErrorModal(state, action) { state.errorModal = { open: true, message: action.payload }; },
    closeErrorModal(state) { state.errorModal = { open: false, message: '' }; },
    showYesNoModal(state, action) {
      state.yesNoModal = {
        open: true,
        message: action.payload.message,
        resolve: action.payload.resolve,
        reject: action.payload.reject,
      };
    },
    closeYesNoModal(state) {
      state.yesNoModal = { open: false, message: '', resolve: null, reject: null };
    },
    showNotification(state, action) { state.notification = action.payload; },
    clearNotification(state) { state.notification = null; },
  },
});

export const {
  openWalletModal,
  closeWalletModal,
  showErrorModal,
  closeErrorModal,
  showYesNoModal,
  closeYesNoModal,
  showNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
