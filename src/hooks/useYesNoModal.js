import { useDispatch } from 'react-redux';
import { showYesNoModal, closeYesNoModal } from '../store/uiSlice';

export const useYesNoModal = () => {
  const dispatch = useDispatch();

  const showModal = (message) => {
    return new Promise((resolve, reject) => {
      dispatch(showYesNoModal({ message, resolve, reject }));
    });
  };

  const closeModal = () => {
    dispatch(closeYesNoModal());
  };

  return {
    showModal,
    closeModal,
  };
}; 