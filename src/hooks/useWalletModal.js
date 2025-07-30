import { useSelector, useDispatch } from 'react-redux';
import { showWalletModal, hideWalletModal } from '../store/uiSlice';

export const useWalletModal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector(state => state.ui.walletModal);

  const openWalletModal = () => {
    dispatch(showWalletModal());
  };

  const closeWalletModal = () => {
    dispatch(hideWalletModal());
  };

  return {
    isOpen,
    openWalletModal,
    closeWalletModal,
  };
}; 