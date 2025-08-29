import React, { useState } from 'react';
import { useErrorModal } from '../hooks/useErrorModal';

const DomainSelectionModal = ({ 
  open, 
  onClose, 
  onDomainSelected
}) => {
  const [customDomain, setCustomDomain] = useState('');
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(null);
  const { showError } = useErrorModal();

  const checkDomainAvailability = async () => {
    if (!customDomain.trim()) {
      showError('Please enter a domain name');
      return;
    }

    // Basic domain validation
    // Validate domain format - allows normal domains like example.com, sub.example.com
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(customDomain.trim())) {
      showError('Domain must be a valid domain name (e.g., example.com, app.example.com). Each part must be 1-63 characters long and contain only letters, numbers, and hyphens. Cannot start or end with a hyphen.');
      return;
    }
    
    // Additional validation for domain length and format
    const domainParts = customDomain.trim().split('.');
    if (domainParts.length < 2) {
      showError('Domain must have at least 2 parts (e.g., example.com)');
      return;
    }
    
    if (domainParts.length > 5) {
      showError('Domain cannot have more than 5 parts');
      return;
    }
    
    // Check each part length
    for (let i = 0; i < domainParts.length; i++) {
      const part = domainParts[i];
      if (part.length < 1 || part.length > 63) {
        showError(`Domain part "${part}" must be 1-63 characters long`);
        return;
      }
      if (part.startsWith('-') || part.endsWith('-')) {
        showError(`Domain part "${part}" cannot start or end with a hyphen`);
        return;
      }
    }
    
    // Check total domain length
    if (customDomain.trim().length > 253) {
      showError('Total domain length cannot exceed 253 characters');
      return;
    }

    setIsCheckingDomain(true);
    setDomainAvailable(null);

    try {
      const response = await fetch('/api/user/check-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subdomain: customDomain.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setDomainAvailable(data.available);
      } else {
        throw new Error('Failed to check domain availability');
      }
    } catch (error) {
      console.error('Error checking domain:', error);
      showError('Failed to check domain availability. Please try again.');
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const handleContinue = () => {
    if (!domainAvailable) {
      showError('Please check domain availability first');
      return;
    }

    onDomainSelected(customDomain.trim());
  };

  const handleClose = () => {
    setCustomDomain('');
    setDomainAvailable(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
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

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            {/* Custom Domain Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Subdomain
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
                    : `Domain "${customDomain}" is already taken. Please try another.`
                  }
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

