import { useEffect, useCallback } from 'react';

// Opens a native browser popup window with Phantom wallet UI
export const openPhantomPopup = () => {
  const width = 380;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  
  const popup = window.open(
    '/phantom-popup.html',
    'PhantomWallet',
    `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no,menubar=no,toolbar=no,location=no`
  );
  
  return popup;
};

// Hook to handle messages from the popup
export const usePhantomPopup = (onAction) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'phantom-action') {
        onAction?.(event.data.action);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAction]);
};

// Legacy component wrapper for backwards compatibility
const PhantomModal = ({ isOpen, onClose, onAction }) => {
  const handleAction = useCallback((action) => {
    onAction?.(action);
    onClose?.();
  }, [onAction, onClose]);
  
  usePhantomPopup(handleAction);
  
  useEffect(() => {
    if (isOpen) {
      const popup = openPhantomPopup();
      
      // Check if popup was blocked
      if (!popup) {
        console.warn('Popup was blocked. Please allow popups for this site.');
      }
      
      // Close handler when popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          onClose?.();
        }
      }, 500);
      
      return () => clearInterval(checkClosed);
    }
  }, [isOpen, onClose]);
  
  return null; // No DOM rendering needed
};

export default PhantomModal;
