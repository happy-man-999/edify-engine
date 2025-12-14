import { useDispatch, useSelector } from 'react-redux';
import { openPhantomModal, closePhantomModal } from '../store/uiSlice';

export const usePhantomModal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector(state => state.ui.phantomModal);

  const showModal = () => {
    dispatch(openPhantomModal());
  };

  const hideModal = () => {
    dispatch(closePhantomModal());
  };

  return {
    isOpen,
    showModal,
    hideModal,
  };
};

