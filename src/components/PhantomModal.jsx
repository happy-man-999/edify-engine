import { useEffect, useCallback } from 'react';

// Opens a native browser popup window with Phantom wallet UI
export const openPhantomPopup = async () => {
  const width = 380;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  
  try {
    // Fetch the HTML content
    const response = await fetch('/phantom-popup.html');
    let htmlContent = await response.text();
    
    // Inject base tag and favicon to fix relative paths and set title bar icon
    const baseUrl = window.location.origin;
    const faviconLink = '<link rel="icon" type="image/png" href="https://lh3.googleusercontent.com/dXvdD2VjLS-imsW8WG2oB3y7sBHhL9gFlv7KZnqZSA9_MU1VROSHRpJidav8-a77uQT1-8X_zK5ibsAC39IFn5tn=s60">';
    // Update title to "Phantom Wallet"
    htmlContent = htmlContent.replace(
      /<title>.*?<\/title>/i,
      '<title>Phantom Wallet</title>'
    );
    htmlContent = htmlContent.replace(
      '<head>',
      `<head><base href="${baseUrl}/">${faviconLink}`
    );
    
    // Inject script to try to hide address bar (limited by browser security)
    const hideAddressBarScript = `
      <script>
        (function() {
          try {
            // Method 1: Try to hide address bar by manipulating window
            if (window.chrome && window.chrome.tabs) {
              // Chrome extension API (won't work in regular pages)
            }
            
            // Method 2: Try to focus body to remove focus from address bar
            document.addEventListener('DOMContentLoaded', function() {
              if (document.body) {
                document.body.focus();
                // Try to blur address bar
                window.blur();
                setTimeout(function() {
                  window.focus();
                  if (document.activeElement) {
                    document.activeElement.blur();
                  }
                }, 10);
              }
            });
            
            // Method 3: Try to hide via CSS (won't hide browser UI but can help)
            var style = document.createElement('style');
            style.textContent = \`
              * {
                -webkit-app-region: no-drag;
              }
              body { 
                margin: 0; 
                padding: 0; 
                overflow: hidden;
                user-select: none;
              }
            \`;
            document.head.appendChild(style);
          } catch(e) {
            console.error('Error hiding address bar:', e);
          }
        })();
      </script>
    `;
    
    htmlContent = htmlContent.replace('</head>', hideAddressBarScript + '</head>');
    
    // Use about:blank and write content - this is the cleanest approach
    // Note: location=no should hide address bar, but browser security may override
    const popup = window.open(
      '',
      'PhantomWallet',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no,menubar=no,toolbar=no,location=no,directories=no`
    );
    
    if (!popup) {
      console.warn('Popup was blocked. Please allow popups for this site.');
      return null;
    }
    
    // Write HTML directly to popup
    popup.document.open();
    popup.document.write(htmlContent);
    popup.document.close();
    
    // Set favicon and title after popup loads (fallback method)
    setTimeout(() => {
      try {
        if (popup && !popup.closed && popup.document) {
          // Set title explicitly
          popup.document.title = 'Phantom Wallet';
          
          // Set favicon dynamically
          let link = popup.document.querySelector("link[rel*='icon']") || popup.document.createElement('link');
          link.type = 'image/png';
          link.rel = 'icon';
          link.href = 'https://lh3.googleusercontent.com/dXvdD2VjLS-imsW8WG2oB3y7sBHhL9gFlv7KZnqZSA9_MU1VROSHRpJidav8-a77uQT1-8X_zK5ibsAC39IFn5tn=s60';
          if (!popup.document.querySelector("link[rel*='icon']")) {
            popup.document.getElementsByTagName('head')[0].appendChild(link);
          }
          
          // Try to remove focus from address bar
          popup.document.body?.focus();
          // Try to blur the window
          popup.blur();
          setTimeout(() => {
            popup.focus();
            if (popup.document.activeElement) {
              popup.document.activeElement.blur();
            }
          }, 50);
        }
      } catch (e) {
        // Cross-origin or security restrictions
      }
    }, 200);
    
    return popup;
  } catch (error) {
    console.error('Failed to load phantom popup:', error);
    // Fallback to direct file path if writing fails
    return window.open(
      '/phantom-popup.html',
      'PhantomWallet',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no,menubar=no,toolbar=no,location=no`
    );
  }
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
      let checkClosedInterval;
      
      openPhantomPopup().then((popup) => {
        // Check if popup was blocked
        if (!popup) {
          console.warn('Popup was blocked. Please allow popups for this site.');
          return;
        }
        
        // Close handler when popup is closed manually
        checkClosedInterval = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosedInterval);
            onClose?.();
          }
        }, 500);
      });
      
      return () => {
        if (checkClosedInterval) {
          clearInterval(checkClosedInterval);
        }
      };
    }
  }, [isOpen, onClose]);
  
  return null; // No DOM rendering needed
};

export default PhantomModal;
