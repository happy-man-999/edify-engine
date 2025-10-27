import { useDispatch } from 'react-redux';
import { showSnapshotNameModal, closeSnapshotNameModal } from '../store/uiSlice';

export const useSnapshotNameModal = () => {
  const dispatch = useDispatch();

  const showModal = (defaultName = '') => {
    return new Promise((resolve) => {
      // Store the resolve function in a closure instead of Redux state
      const modalId = Date.now().toString();
      
      // Create a custom event listener for this modal
      const handleModalResponse = (event) => {
        if (event.detail.modalId === modalId) {
          window.removeEventListener('snapshotNameModalResponse', handleModalResponse);
          resolve(event.detail.result);
        }
      };
      
      window.addEventListener('snapshotNameModalResponse', handleModalResponse);
      
      // Dispatch action with only serializable data
      dispatch(showSnapshotNameModal({ 
        modalId,
        defaultName 
      }));
    });
  };

  const closeModal = () => {
    dispatch(closeSnapshotNameModal());
  };

  return {
    showModal,
    closeModal,
  };
};

