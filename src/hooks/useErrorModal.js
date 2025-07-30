import { useDispatch } from 'react-redux';
import { showErrorModal, closeErrorModal } from '../store/uiSlice';

export const useErrorModal = () => {
  const dispatch = useDispatch();

  const showError = (message) => {
    dispatch(showErrorModal(message));
  };

  const hideError = () => {
    dispatch(closeErrorModal());
  };

  const showErrorWithAction = (message, action) => {
    dispatch(showErrorModal({
      message,
      action: action || null
    }));
  };

  return {
    showError,
    hideError,
    showErrorWithAction,
  };
}; 