import { useDispatch } from 'react-redux';
import { showSnapshotSelectionModal, closeSnapshotSelectionModal } from '../store/uiSlice';

export const useSnapshotSelectionModal = () => {
  const dispatch = useDispatch();

  const showModal = () => {
    return new Promise((resolve) => {
      // Store the resolve function in a closure instead of Redux state
      const modalId = Date.now().toString();
      
      // Create a custom event listener for this modal
      const handleModalResponse = (event) => {
        if (event.detail.modalId === modalId) {
          window.removeEventListener('snapshotSelectionModalResponse', handleModalResponse);
          resolve(event.detail.result);
        }
      };
      
      window.addEventListener('snapshotSelectionModalResponse', handleModalResponse);
      
      // Dispatch action with only serializable data
      dispatch(showSnapshotSelectionModal({ 
        modalId
      }));
    });
  };

  const closeModal = () => {
    dispatch(closeSnapshotSelectionModal());
  };

  return {
    showModal,
    closeModal,
  };
};

