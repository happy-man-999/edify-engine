import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useErrorModal } from '../hooks/useErrorModal';
import { useEntri } from '../hooks/useEntri';
import { useWebhook } from '../hooks/useWebhook';
import { isValidDomainFormat } from '../utils/domainUtils';
import { showNotification } from '../store/uiSlice';

const DomainSelectionModal = ({ open, onClose }) => {
  const [customDomain, setCustomDomain] = useState('');
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(null);
  const dispatch = useDispatch();
  const { showError } = useErrorModal();
  const { dropletId } = useSelector(state => state.ui.domainModal);
  const { user } = useSelector(state => state.auth);
  
  // Custom domain webhook for real-time updates
  const { lastEvent, isConnected } = useWebhook(user?.id, open);

  // Handle webhook events
  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.type === 'custom-domain-setup-completed') {
        dispatch(showNotification(`Custom domain ${lastEvent.data.customDomain} setup completed successfully!`));
        // Close the modal after successful setup
        onClose();
      } else if (lastEvent.type === 'custom-domain-setup-failed') {
        dispatch(showNotification(`Custom domain setup failed: ${lastEvent.data.error}`));
      }
    }
  }, [lastEvent, dispatch, onClose]);

  const handleOnEntriClose = event => {
    console.log('onEntriClose', event.detail);
  }

  const { proceedWithEntri } = useEntri(handleOnEntriClose);

  const fetchDropletIP = async () => {
    if (!dropletId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/dns/droplet/${dropletId}/ip`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.ipAddress;
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch droplet IP:', errorData);
      }
    } catch (error) {
      console.error('Error fetching droplet IP:', error);
    }
  };

  const checkDomainAvailability = async () => {
    if (!customDomain.trim()) {
      showError('Please enter a domain name');
      return;
    }

    // Use utility function for domain validation
    if (!isValidDomainFormat(customDomain.trim())) {
      showError('Domain must be a valid domain name (e.g., example.com, app.example.com). Each part must be 1-63 characters long and contain only letters, numbers, and hyphens. Cannot start or end with a hyphen.');
      return;
    }

    setIsCheckingDomain(true);
    setDomainAvailable(null);

    try {
      // Make request to server-side health check endpoint
      const domain = customDomain.trim();
      const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
      
      console.log('Checking domain health via server:', domain);

      const response = await fetch(`/api/dns/check-health?domain=${encodeURIComponent(domain)}&protocol=${protocol}`);

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.status === 'ok') {
          // Domain is alive and responding correctly
          setDomainAvailable(true);
        } else {
          // Domain responds but status is not "ok" or request failed
          setDomainAvailable(false);
          showError(`Domain "${domain}" is not configured correctly.`);
        }
      } else {
        // Server error
        setDomainAvailable(false);
        showError(`Domain "${domain}" verification failed.`);
      }
    } catch (error) {
      console.error('Error checking domain health:', error);
      
      // Handle error cases - all treated as domain not configured
      setDomainAvailable(false);
      showError(`Domain "${customDomain}" verification failed.`);
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const handleEntriSetup = async () => {
    const dropletIP = await fetchDropletIP();
    proceedWithEntri(customDomain.trim(), dropletIP);
  };

  const handleContinue = async () => {
    if (!domainAvailable) {
      showError('Please check domain availability first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dns/custom-domain/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dropletId: dropletId,
          customDomain: customDomain.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Show success notification
        dispatch(showNotification(data.message));
        // Close the modal
        onClose();
      } else {
        throw new Error(data.message || 'Failed to setup custom domain');
      }
    } catch (error) {
      console.error('Error setting up custom domain:', error);
      showError('Failed to setup custom domain: ' + error.message);
    }
  };

  const handleClose = () => {
    setCustomDomain('');
    setDomainAvailable(null);
    setDropletIP(null);
    onClose();
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Custom Domain</h2>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-white/90 mt-2">
            Choose your custom domain for this world
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4 mb-6">
            {/* Custom Domain Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Domain
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="myworld.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42677D] focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && checkDomainAvailability()}
                />
                <button
                  onClick={checkDomainAvailability}
                  disabled={isCheckingDomain || !customDomain.trim()}
                  className="px-4 py-2 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingDomain ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-check"></i>
                  )}
                </button>
              </div>
                
              {/* Domain Availability Status */}
              {domainAvailable !== null && (
                <div className={`mt-2 text-sm ${
                  domainAvailable ? 'text-green-600' : 'text-red-600'
                }`}>
                  <i className={`fas fa-${domainAvailable ? 'check-circle' : 'times-circle'} mr-1`}></i>
                  {domainAvailable 
                    ? `Domain "${customDomain}" is available!`
                    : `Domain "${customDomain}" is not configured correctly.`
                  }
                </div>
              )}

              {/* Entri Integration Button */}
              {domainAvailable === false && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-3">
                    Your domain needs to be configured. Use Entri to automatically set up DNS records.
                  </p>
                  
                  <button
                    onClick={handleEntriSetup}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <i className="fas fa-cog mr-2"></i>
                    Configure with Entri
                  </button>
                </div>
              )}
                
              <p className="text-xs text-gray-500 mt-2">
                Your world will be accessible at: {customDomain.trim() || 'myworld.com'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!domainAvailable}
                className="flex-1 px-4 py-3 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainSelectionModal;

