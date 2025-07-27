import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearNotification } from '../store/uiSlice';

const Notification = ({ message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-slideIn z-[2000]">
      <i className="fas fa-check-circle mr-2"></i>
      <span>{message}</span>
      <button className="ml-2" onClick={() => dispatch(clearNotification())}>&times;</button>
    </div>
  );
};

export default Notification;