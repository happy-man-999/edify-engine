import store from '../store/index';
import { showYesNoModal, closeYesNoModal } from '../store/uiSlice';

export default function showYesNoModalPromise(message) {
  return new Promise((resolve, reject) => {
    store.dispatch(showYesNoModal({ message, resolve, reject }));
  });
}