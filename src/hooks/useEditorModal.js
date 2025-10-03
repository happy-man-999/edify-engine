import { useDispatch } from 'react-redux';
import { openEditorModal, closeEditorModal } from '../store/uiSlice';

export const useEditorModal = () => {
  const dispatch = useDispatch();

  const showModal = (subdomain) => {
    dispatch(openEditorModal(subdomain));
  };

  const closeModal = () => {
    dispatch(closeEditorModal());
  };

  return {
    showModal,
    closeModal,
  };
};
