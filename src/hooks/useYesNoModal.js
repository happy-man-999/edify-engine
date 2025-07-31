import { useDispatch } from 'react-redux';
import { showYesNoModal, closeYesNoModal } from '../store/uiSlice';

export const useYesNoModal = () => {
  const dispatch = useDispatch();

  const showModal = (message) => {
    return new Promise((resolve) => {
      // Store the resolve function in a closure instead of Redux state
      const modalId = Date.now().toString();
      
      // Create a custom event listener for this modal
      const handleModalResponse = (event) => {
        if (event.detail.modalId === modalId) {
          window.removeEventListener('yesNoModalResponse', handleModalResponse);
          resolve(event.detail.result);
        }
      };
      
      window.addEventListener('yesNoModalResponse', handleModalResponse);
      
      // Dispatch action with only serializable data
      dispatch(showYesNoModal({ 
        message, 
        modalId 
      }));
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