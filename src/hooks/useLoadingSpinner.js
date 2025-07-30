import { useDispatch } from 'react-redux';
import { showLoadingSpinner, hideLoadingSpinner } from '../store/uiSlice';

export const useLoadingSpinner = () => {
  const dispatch = useDispatch();

  const showSpinner = (message = 'Loading...') => {
    dispatch(showLoadingSpinner(message));
  };

  const hideSpinner = () => {
    dispatch(hideLoadingSpinner());
  };

  const withSpinner = async (asyncFunction, message = 'Loading...') => {
    try {
      showSpinner(message);
      const result = await asyncFunction();
      return result;
    } finally {
      hideSpinner();
    }
  };

  return {
    showSpinner,
    hideSpinner,
    withSpinner,
  };
}; 