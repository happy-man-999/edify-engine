import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useErrorModal } from '../hooks/useErrorModal';
import { useEntri } from '../hooks/useEntri';
import { useWebhook } from '../hooks/useWebhook';
import { useUserDroplets } from '../hooks/useUserDroplets';
import { isValidDomainFormat } from '../utils/domainUtils';
import { showNotification } from '../store/uiSlice';

const DomainSelectionModal = ({ open, onClose }) => {
  const [customDomain, setCustomDomain] = useState('');
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(null);
  const [isLoadingEntri, setIsLoadingEntri] = useState(false);
  const [isPurchasingDomain, setIsPurchasingDomain] = useState(false);
  const [useEntry, setUseEntry] = useState(true);
  const [dropletIP, setDropletIP] = useState(null);
  const dispatch = useDispatch();
  const { showError } = useErrorModal();
  const { dropletId } = useSelector(state => state.ui.domainModal);
  const { user } = useSelector(state => state.auth);
  const { refreshUserDroplets } = useUserDroplets();
  
  // Custom domain webhook for real-time updates
  const { lastEvent, isConnected } = useWebhook(user?.id, open);

  // Fetch settings and droplet IP when modal opens
  useEffect(() => {
    if (open) {
      fetchSettings();
      fetchDropletIP();
    }
  }, [open]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/payment-settings');
      if (response.ok) {
        const data = await response.json();
        setUseEntry(data.settings?.useEntry !== false); // Default to true if not set
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Default to true on error
      setUseEntry(true);
    }
  };

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

  // Handle domain purchase callback from Entri
  useEffect(() => {
    if (open) {
      const urlParams = new URLSearchParams(window.location.search);
      const purchasedDomain = urlParams.get('domain');
      const fromPurchase = urlParams.get('fromPurchase');
      const purchaseCancelled = urlParams.get('purchaseCancelled');
      
      // Entri redirects to successCallbackUrl with ?domain=mydomain.com
      // Check if this is a return from purchase flow
      if (purchasedDomain && fromPurchase === 'true') {
        // Set the purchased domain and check availability
        setCustomDomain(purchasedDomain);
        setIsPurchasingDomain(false);
        
        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // Auto-check the domain after a brief delay to allow DNS propagation
        setTimeout(() => {
          checkDomainAvailability();
        }, 500);
        
        dispatch(showNotification(`Domain ${purchasedDomain} purchased successfully! Verifying configuration...`));
      } else if (purchaseCancelled === 'true') {
        setIsPurchasingDomain(false);
        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        dispatch(showNotification('Domain purchase cancelled.'));
      }
    }
  }, [open, dispatch]);

  const handleOnEntriClose = event => {
    setIsLoadingEntri(false);
    console.log('onEntriClose', event.detail);
  }

  const { proceedWithEntri, purchaseDomain } = useEntri(handleOnEntriClose);

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
        setDropletIP(data.ipAddress);
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

      const response = await fetch(`/api/dns/check-health?domain=${encodeURIComponent(domain)}&dropletId=${dropletId}&protocol=${protocol}`);

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.status === 'connected') {
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
    setIsLoadingEntri(true);
    const ip = dropletIP || await fetchDropletIP();
    if (ip) {
      proceedWithEntri(customDomain.trim(), ip);
    } else {
      showError('Failed to get droplet IP address');
      setIsLoadingEntri(false);
    }
  };

  const handlePurchaseDomain = async () => {
    setIsPurchasingDomain(true);
    
    try {
      // Get droplet IP
      const ip = dropletIP || await fetchDropletIP();
      if (!ip) {
        throw new Error('Failed to get droplet IP address');
      }

      // Construct callback URLs
      // Entri will redirect to successCallbackUrl with ?domain=mydomain.com
      const baseUrl = window.location.origin + window.location.pathname;
      const successCallbackUrl = `${baseUrl}?fromPurchase=true`;
      const exitCallbackUrl = `${baseUrl}?purchaseCancelled=true`;

      // Use the purchaseDomain function from useEntri hook
      await purchaseDomain(ip, successCallbackUrl, exitCallbackUrl);
      
    } catch (error) {
      console.error('Error purchasing domain:', error);
      showError('Failed to open domain purchase flow: ' + error.message);
      setIsPurchasingDomain(false);
    }
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
        // Refresh user droplets to update the UI
        refreshUserDroplets();
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
    onClose();
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div 
        className="rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-modalFadeIn"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Header */}
        <div 
          className="p-6 flex-shrink-0"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
        >
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
            {/* Domain Purchase Section - Only show when useEntry is true */}
            {useEntry && (
              <>
                <div className="mb-6 p-4 rounded-lg" style={{ background: 'linear-gradient(to right, oklch(0.50 0.18 260 / 0.1), oklch(0.45 0.15 290 / 0.1))', borderColor: 'oklch(0.50 0.18 260 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                  <p className="text-sm mb-3" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    Don't have a custom domain yet? You can purchase one directly here and we'll automatically configure it for your world.
                  </p>
                  <button
                    onClick={handlePurchaseDomain}
                    disabled={isPurchasingDomain}
                    className="w-full px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                    style={{
                      background: 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.45 0.15 290))',
                      color: 'oklch(0.98 0.01 280)'
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.55 0.18 260), oklch(0.50 0.18 260))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.45 0.15 290))';
                      }
                    }}
                  >
                    {isPurchasingDomain ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Opening purchase flow...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shopping-cart mr-2"></i>
                        Buy a Domain
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="mb-6 flex items-center">
                  <div className="flex-1" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}></div>
                  <span className="px-3 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>OR</span>
                  <div className="flex-1" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}></div>
                </div>
              </>
            )}

            {/* Custom Domain Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Your Domain
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="myworld.com"
                  className="flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'oklch(0.12 0.02 280)',
                    borderColor: 'oklch(0.25 0.05 285)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: 'oklch(0.98 0.01 280)',
                    '--tw-ring-color': 'oklch(0.45 0.15 290)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && checkDomainAvailability()}
                />
                <button
                  onClick={checkDomainAvailability}
                  disabled={isCheckingDomain || !customDomain.trim()}
                  className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'oklch(0.45 0.15 290)',
                    color: 'oklch(0.98 0.01 280)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                    }
                  }}
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
                <div className="mt-2 text-sm" style={{ color: domainAvailable ? 'oklch(0.70 0.15 150)' : 'oklch(0.55 0.22 25)' }}>
                  <i className={`fas fa-${domainAvailable ? 'check-circle' : 'times-circle'} mr-1`}></i>
                  {domainAvailable 
                    ? `Domain "${customDomain}" is available!`
                    : `Domain "${customDomain}" is not configured correctly.`
                  }
                </div>
              )}

              {/* Entri Integration Button or DNS Instructions */}
              {domainAvailable === false && (
                <>
                  {useEntry ? (
                    <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                      <p className="text-sm mb-3" style={{ color: 'oklch(0.45 0.15 290)' }}>
                        We need to finish configuring your domain. You can click button to automatically set up your DNS records. If you've already updated your domain settings, please give it some time - changes may take a little while to show up.
                      </p>
                      
                      <button
                        onClick={handleEntriSetup}
                        disabled={isLoadingEntri}
                        className="w-full px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        style={{
                          backgroundColor: 'oklch(0.45 0.15 290)',
                          color: 'oklch(0.98 0.01 280)'
                        }}
                        onMouseEnter={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!e.currentTarget.disabled) {
                            e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                          }
                        }}
                      >
                        <i className="fas fa-cog mr-2"></i>
                        Connect Domain
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {/* Warning Banner */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.1)', borderColor: 'oklch(0.85 0.18 130 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                        <p className="text-sm" style={{ color: 'oklch(0.85 0.18 130)' }}>
                          <i className="fas fa-exclamation-triangle mr-2"></i>
                          Your domain's IP address doesn't match our server, or DNS records are not yet configured. This is normal for newly created domains. You need to add DNS records to point your domain to our server.
                        </p>
                      </div>

                      {/* World's IP Address */}
                      {dropletIP && (
                        <div>
                          <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Your World's IP Address:</p>
                          <div className="p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                            <p className="font-mono text-lg font-semibold" style={{ color: 'oklch(0.45 0.15 290)' }}>{dropletIP}</p>
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'oklch(0.45 0.15 290)' }}>This is the IP address of your specific world</p>
                        </div>
                      )}

                      {/* Cloudflare DNS Setup */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                        <div className="flex items-center mb-3">
                          <i className="fas fa-cloud text-xl mr-2" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
                          <h4 className="text-base font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Cloudflare DNS Setup</h4>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                          <li>Log into your Cloudflare dashboard</li>
                          <li>Select your domain</li>
                          <li>Go to <strong>DNS</strong> → <strong>Records</strong></li>
                          <li>Click <strong>Add record</strong></li>
                          <li>Set <strong>Type</strong> to <span className="px-2 py-1 rounded" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>A</span></li>
                          <li>Set <strong>Name</strong> to <span className="px-2 py-1 rounded" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>@</span> (or leave blank for root domain)</li>
                          <li>Set <strong>IPv4 address</strong> to your world's IP: <span className="px-2 py-1 rounded font-mono" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>{dropletIP || 'YOUR_IP'}</span></li>
                          <li>Set <strong>Proxy status</strong> to <span className="px-2 py-1 rounded" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>DNS only</span></li>
                          <li>Click <strong>Save</strong></li>
                        </ol>
                      </div>

                      {/* GoDaddy DNS Setup */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                        <div className="flex items-center mb-3">
                          <i className="fas fa-globe text-xl mr-2" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
                          <h4 className="text-base font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>GoDaddy DNS Setup</h4>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                          <li>Log into your GoDaddy account</li>
                          <li>Go to <strong>My Products</strong> → <strong>DNS</strong></li>
                          <li>Find your domain and click <strong>DNS</strong></li>
                          <li>Click <strong>Add</strong> under <strong>A Records</strong></li>
                          <li>Set <strong>Type</strong> to <span className="px-2 py-1 rounded" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>A</span></li>
                          <li>Set <strong>Host</strong> to <span className="px-2 py-1 rounded" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>@</span></li>
                          <li>Set <strong>Points to</strong> to your world's IP: <span className="px-2 py-1 rounded font-mono" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>{dropletIP || 'YOUR_IP'}</span></li>
                          <li>Set <strong>TTL</strong> to <span className="px-2 py-1 rounded" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }}>600</span> (10 minutes)</li>
                          <li>Click <strong>Save</strong></li>
                        </ol>
                      </div>

                      {/* Important Notes */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.1)', borderColor: 'oklch(0.85 0.18 130 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                        <div className="flex items-start">
                          <i className="fas fa-info-circle mt-0.5 mr-2" style={{ color: 'oklch(0.85 0.18 130)' }}></i>
                          <div className="text-sm" style={{ color: 'oklch(0.85 0.18 130)' }}>
                            <h4 className="font-semibold mb-2">Important Notes</h4>
                            <ul className="list-disc list-inside space-y-1">
                              <li>DNS changes can take 24-48 hours to propagate globally</li>
                              <li>Make sure to set the record type to <strong>A</strong> (not CNAME)</li>
                              <li>For subdomains, use the subdomain name instead of <strong>@</strong></li>
                              <li>After adding records, wait a few minutes before checking again</li>
                              <li>Use the IP address shown above: <span className="font-mono font-semibold" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)' }}>{dropletIP || 'YOUR_IP'}</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
                
              <p className="text-xs mt-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Your world will be accessible at: {customDomain.trim() || 'myworld.com'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'oklch(0.25 0.05 285)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!domainAvailable}
                className="flex-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'oklch(0.45 0.15 290)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                  }
                }}
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

