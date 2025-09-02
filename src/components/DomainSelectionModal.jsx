import React, { useState, useEffect } from 'react';
import { useErrorModal } from '../hooks/useErrorModal';

const DomainSelectionModal = ({ 
  open, 
  onClose, 
  onDomainSelected,
  dropletId
}) => {
  const [customDomain, setCustomDomain] = useState('');
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(null);
  const [showDnsInstructions, setShowDnsInstructions] = useState(false);
  const [dropletIP, setDropletIP] = useState(null);
  const [isLoadingIP, setIsLoadingIP] = useState(false);
  const { showError } = useErrorModal();

  // Fetch droplet IP when modal opens
  useEffect(() => {
    if (open && dropletId) {
      fetchDropletIP();
    }
  }, [open, dropletId]);

  const fetchDropletIP = async () => {
    if (!dropletId) return;
    
    setIsLoadingIP(true);
    try {
      const response = await fetch(`/api/dns/droplet/${dropletId}/ip`);
      
      if (response.ok) {
        const data = await response.json();
        setDropletIP(data.ipAddress);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch droplet IP:', errorData);
        setDropletIP(null);
      }
    } catch (error) {
      console.error('Error fetching droplet IP:', error);
      setDropletIP(null);
    } finally {
      setIsLoadingIP(false);
    }
  };



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
    setShowDnsInstructions(false);

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
          setShowDnsInstructions(true);
          showError(`Domain "${domain}" is not configured correctly. Please configure DNS records.`);
        }
      } else {
        // Server error
        setDomainAvailable(false);
        setShowDnsInstructions(true);
        showError(`Domain "${domain}" verification failed. Please configure DNS records.`);
      }
    } catch (error) {
      console.error('Error checking domain health:', error);
      
      // Handle error cases - all treated as domain not configured
      setDomainAvailable(false);
      setShowDnsInstructions(true);
      showError(`Domain "${customDomain}" verification failed. Please configure DNS records to point to your world's IP: ${dropletIP || 'Loading...'}`);
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const handleAlreadyAdded = () => {
    showError('You must wait until DNS propagation is complete. This can take up to 24-48 hours.');
    onClose();
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
    setShowDnsInstructions(false);
    setDropletIP(null);
    onClose();
  };

  // Get the droplet's IP address for DNS instructions
  const getDropletIP = () => {
    if (isLoadingIP) {
      return 'Loading...';
    }
    if (!dropletIP) {
      return 'IP address not available';
    }
    return dropletIP;
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
                    : `Domain "${customDomain}" IP doesn't match. Please configure DNS records.`
                  }
                </div>
              )}

              {/* DNS Instructions */}
              {showDnsInstructions && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-3">
                    Your domain's IP address doesn't match our server, or DNS records are not yet configured. This is normal for newly created domains. You need to add DNS records to point your domain to our server.
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Your World's IP Address:</h4>
                    <div className="bg-blue-100 p-2 rounded border border-blue-300">
                      <code className="text-blue-800 font-mono text-sm">
                        {getDropletIP()}
                      </code>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      This is the IP address of your specific world (droplet)
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Cloudflare Instructions */}
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <i className="fas fa-cloud mr-2 text-blue-600"></i>
                        Cloudflare DNS Setup
                      </h5>
                      <ol className="text-sm text-blue-800 space-y-1 ml-4">
                        <li>1. Log into your Cloudflare dashboard</li>
                        <li>2. Select your domain</li>
                        <li>3. Go to <strong>DNS</strong> → <strong>Records</strong></li>
                        <li>4. Click <strong>Add record</strong></li>
                        <li>5. Set <strong>Type</strong> to <code className="bg-blue-100 px-1 rounded">A</code></li>
                        <li>6. Set <strong>Name</strong> to <code className="bg-blue-100 px-1 rounded">@</code> (or leave blank for root domain)</li>
                        <li>7. Set <strong>IPv4 address</strong> to your world's IP: <code className="bg-blue-100 px-1 rounded">{getDropletIP()}</code></li>
                        <li>8. Set <strong>Proxy status</strong> to <code className="bg-blue-100 px-1 rounded">DNS only</code></li>
                        <li>9. Click <strong>Save</strong></li>
                      </ol>
                    </div>

                    {/* GoDaddy Instructions */}
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <i className="fas fa-globe mr-2 text-blue-600"></i>
                        GoDaddy DNS Setup
                      </h5>
                      <ol className="text-sm text-blue-800 space-y-1 ml-4">
                        <li>1. Log into your GoDaddy account</li>
                        <li>2. Go to <strong>My Products</strong> → <strong>DNS</strong></li>
                        <li>3. Find your domain and click <strong>DNS</strong></li>
                        <li>4. Click <strong>Add</strong> under <strong>A Records</strong></li>
                        <li>5. Set <strong>Type</strong> to <code className="bg-blue-100 px-1 rounded">A</code></li>
                        <li>6. Set <strong>Host</strong> to <code className="bg-blue-100 px-1 rounded">@</code></li>
                        <li>7. Set <strong>Points to</strong> to your world's IP: <code className="bg-blue-100 px-1 rounded">{getDropletIP()}</code></li>
                        <li>8. Set <strong>TTL</strong> to <code className="bg-blue-100 px-1 rounded">600</code> (10 minutes)</li>
                        <li>9. Click <strong>Save</strong></li>
                      </ol>
                    </div>

                    {/* General Instructions */}
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <i className="fas fa-info-circle mr-2 text-yellow-600"></i>
                        Important Notes
                      </h5>
                      <ul className="text-sm text-yellow-800 space-y-1 ml-4">
                        <li>• DNS changes can take 24-48 hours to propagate globally</li>
                        <li>• Make sure to set the record type to <strong>A</strong> (not CNAME)</li>
                        <li>• For subdomains, use the subdomain name instead of <code className="bg-yellow-100 px-1 rounded">@</code></li>
                        <li>• After adding records, wait a few minutes before checking again</li>
                        <li>• Use the IP address shown above: <code className="bg-yellow-100 px-1 rounded">{getDropletIP()}</code></li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleAlreadyAdded}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      I've Added the Records
                    </button>
                    <button
                      onClick={checkDomainAvailability}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Check Again
                    </button>
                  </div>
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

