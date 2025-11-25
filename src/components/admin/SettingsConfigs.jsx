import React, { useState, useEffect } from 'react';

const SettingsConfigs = () => {
  const [settings, setSettings] = useState({
    defaultSnapshotId: 123456,
    defaultDnsDomain: 'edifyengine.com',
    stripeMode: 'live',
    solanaMode: 'mainnet',
    isTestMode: false,
    solanaWalletAddress: '11111111111111111111111111111111',
    stripePublicKey: '',
    stripeSecretKey: '',
    requiredWithdrawAmount: 0.33333
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUpdatingSnapshot, setIsUpdatingSnapshot] = useState(false);
  const [isUpdatingDemoWorld, setIsUpdatingDemoWorld] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Update payment settings when test mode changes
  useEffect(() => {
    if (settings.isTestMode) {
      setSettings(prev => ({
        ...prev,
        stripeMode: 'test',
        solanaMode: 'devnet'
      }));
    }
  }, [settings.isTestMode]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setMessage('');

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setMessage('Settings saved successfully!');
      
      // Refresh all services to apply new settings
      try {
        const refreshResponse = await fetch('/api/admin/refresh-services', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log('Services refreshed:', refreshData);
          setMessage('Settings saved and services refreshed successfully!');
        } else {
          console.warn('Settings saved but service refresh failed');
        }
      } catch (refreshError) {
        console.warn('Settings saved but service refresh failed:', refreshError);
        // Don't fail the entire operation if refresh fails
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshStripe = async () => {
    try {
      setMessage('Refreshing Stripe configuration...');
      
      // Call the server to refresh Stripe instance
      const response = await fetch('/api/admin/refresh-stripe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage('Stripe configuration refreshed successfully!');
      } else {
        throw new Error('Failed to refresh Stripe configuration');
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error refreshing Stripe:', error);
      setMessage(error.message || 'Failed to refresh Stripe configuration');
    }
  };

  const handleExportReport = (type) => {
    console.log(`Exporting ${type} report`);
    // Implement export logic
  };

  const handleTestModeStatus = async () => {
    try {
      setMessage('Checking Test Mode Status...');
      const response = await fetch('/api/admin/test-mode-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check test mode status');
      }

      const data = await response.json();
      console.log('Test Mode Status:', data);
      
      const statusMessage = `Current Status: Test Mode ${data.settings.isTestMode ? 'ENABLED' : 'DISABLED'} | Stripe: ${data.settings.effectiveStripeMode.toUpperCase()} | Solana: ${data.settings.effectiveSolanaMode.toUpperCase()}`;
      setMessage(statusMessage);
      
      // Clear message after 8 seconds to allow reading
      setTimeout(() => setMessage(''), 8000);
    } catch (error) {
      console.error('Error checking test mode status:', error);
      setMessage(error.message || 'Failed to check test mode status');
    }
  };

  const handleUpdateSnapshot = async () => {
    try {
      setIsUpdatingSnapshot(true);
      setMessage('Initiating snapshot update... This may take several minutes.');
      
      const response = await fetch('/api/admin/update-snapshot', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate snapshot update');
      }

      const data = await response.json();
      console.log('Snapshot update initiated:', data);
      
      if (data.actionId) {
        // Start polling for status
        pollSnapshotStatus(data.actionId);
      } else {
        throw new Error('No action ID received from server');
      }
      
    } catch (error) {
      console.error('Error updating snapshot:', error);
      setMessage(error.message || 'Failed to update snapshot');
      setIsUpdatingSnapshot(false);
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleUpdateDemoWorld = async () => {
    try {
      setIsUpdatingDemoWorld(true);
      setMessage('Syncing Demo world... This may take a moment.');

      const response = await fetch('/api/admin/update-demo-world', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update Demo world');
      }

      const data = await response.json();

      if (data.actionId) {
        pollDemoWorldStatus(data.actionId);
      } else {
        throw new Error('No action ID received from server');
      }
    } catch (error) {
      console.error('Error updating Demo world:', error);
      setMessage(error.message || 'Failed to update Demo world');
      setIsUpdatingDemoWorld(false);

      setTimeout(() => setMessage(''), 7000);
    }
  };

  const pollSnapshotStatus = async (actionId) => {
    const maxAttempts = 180; // 5 minutes with 5-second intervals
    let attempts = 0;
    
    const poll = async () => {
      try {
        attempts++;
        setMessage(`Checking snapshot status... (Attempt ${attempts}/${maxAttempts})`);
        
        const response = await fetch(`/api/user/status/${actionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to check snapshot status');
        }

        const data = await response.json();
        console.log('Snapshot status:', data);
        
        if (data.status === 'completed') {
          // Update the local settings with the new snapshot ID
          if (data.result && data.result.snapshotId) {
            setSettings(prev => ({
              ...prev,
              defaultSnapshotId: data.result.snapshotId
            }));
            
            setMessage(`Snapshot updated successfully! New snapshot ID: ${data.result.snapshotId}`);
          } else {
            setMessage('Snapshot updated successfully!');
          }
          setIsUpdatingSnapshot(false);
          
          // Clear message after 5 seconds
          setTimeout(() => setMessage(''), 5000);
          return;
        } else if (data.status === 'failed') {
          const errorMsg = data.error ? data.error.message : 'Unknown error occurred';
          setMessage(`Snapshot update failed: ${errorMsg}`);
          setIsUpdatingSnapshot(false);
          
          // Clear error message after 5 seconds
          setTimeout(() => setMessage(''), 5000);
          return;
        } else if (data.status === 'in_progress') {
          // Show progress message if available
          if (data.progressMessage) {
            setMessage(`${data.progressMessage} (${data.progress || 0}%)`);
          }
          
          if (attempts >= maxAttempts) {
            setMessage('Snapshot update is taking longer than expected. Please check the server logs.');
            setIsUpdatingSnapshot(false);
            return;
          }
          
          // Continue polling
          setTimeout(poll, 5000);
        }
      } catch (error) {
        console.error('Error polling snapshot status:', error);
        
        if (attempts >= maxAttempts) {
          setMessage('Failed to check snapshot status. Please check the server logs.');
          setIsUpdatingSnapshot(false);
          return;
        }
        
        // Retry after 5 seconds
        setTimeout(poll, 5000);
      }
    };
    
    // Start polling
    poll();
  };

  const pollDemoWorldStatus = async (actionId) => {
    const maxAttempts = 180;
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        setMessage(`Checking Demo world update status... (Attempt ${attempts}/${maxAttempts})`);

        const response = await fetch(`/api/user/status/${actionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to check Demo world update status');
        }

        const data = await response.json();
        console.log('Demo world update status:', data);

        if (data.status === 'completed') {
          const successMessage =
            data.result?.message || 'Try world updated successfully!';
          setMessage(successMessage);
          setIsUpdatingTryWorld(false);
          setTimeout(() => setMessage(''), 5000);
          return;
        } else if (data.status === 'failed') {
          const errorMsg = data.error ? data.error.message : 'Unknown error occurred';
          setMessage(`Demo world update failed: ${errorMsg}`);
          setIsUpdatingDemoWorld(false);
          setTimeout(() => setMessage(''), 7000);
          return;
        } else if (data.status === 'in_progress') {
          if (data.progressMessage) {
            setMessage(`${data.progressMessage} (${data.progress || 0}%)`);
          }

          if (attempts >= maxAttempts) {
            setMessage('Demo world update is taking longer than expected. Please check the server logs.');
            setIsUpdatingDemoWorld(false);
            return;
          }

          setTimeout(poll, 5000);
        }
      } catch (error) {
        console.error('Error polling Demo world update status:', error);

        if (attempts >= maxAttempts) {
          setMessage('Failed to check Demo world update status. Please check the server logs.');
          setIsUpdatingDemoWorld(false);
          return;
        }

        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  const renderMessageAlert = () => {
    if (!message) return null;

    const isErrorMessage = /failed|error/i.test(message);
    const isSuccessMessage = /success/i.test(message);
    
    const alertStyle = isErrorMessage
      ? { backgroundColor: 'oklch(0.55 0.22 25 / 0.1)', color: 'oklch(0.55 0.22 25)', borderColor: 'oklch(0.55 0.22 25 / 0.3)' }
      : isSuccessMessage
      ? { backgroundColor: 'oklch(0.70 0.15 150 / 0.1)', color: 'oklch(0.70 0.15 150)', borderColor: 'oklch(0.70 0.15 150 / 0.3)' }
      : { backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', color: 'oklch(0.45 0.15 290)', borderColor: 'oklch(0.45 0.15 290 / 0.3)' };

    return (
      <div className="p-4 rounded-lg" style={{ ...alertStyle, borderWidth: '1px', borderStyle: 'solid' }}>
        {message}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Settings & Configs</h2>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Manage system configuration and export reports</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={
              saving
                ? { backgroundColor: 'oklch(0.50 0.05 280)', color: 'oklch(0.98 0.01 280)' }
                : { backgroundColor: 'oklch(0.45 0.15 290)', color: 'oklch(0.98 0.01 280)' }
            }
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled && !saving) {
                e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled && !saving) {
                e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
              }
            }}
          >
            <i className="fas fa-save mr-2"></i>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          
          <button 
            onClick={handleRefreshStripe}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.70 0.15 150)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.75 0.15 150)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.70 0.15 150)';
            }}
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh Stripe
          </button>

          <button 
            onClick={handleTestModeStatus}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.50 0.18 260)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.55 0.18 260)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
            }}
          >
            <i className="fas fa-vial mr-2"></i>
            Test Mode Status
          </button>
        </div>
      </div>

      {/* Message */}
      {renderMessageAlert()}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure Settings */}
        <div 
          className="rounded-lg shadow p-6"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285)',
            borderColor: 'oklch(0.25 0.05 285)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>
            <i className="fas fa-server mr-2" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
            Infrastructure Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Default Snapshot ID
              </label>
              <input
                type="number"
                value={settings.defaultSnapshotId}
                onChange={(e) => handleSettingChange('defaultSnapshotId', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
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
                placeholder="123456"
                min="1"
              />
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>Base image snapshot ID for new droplets</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Default DNS Domain
              </label>
              <input
                type="text"
                value={settings.defaultDnsDomain}
                onChange={(e) => handleSettingChange('defaultDnsDomain', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
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
                placeholder="edifyengine.com"
              />
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>Default domain for droplet subdomains</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Snapshot Management
              </label>
              <button
                onClick={handleUpdateSnapshot}
                disabled={isUpdatingSnapshot}
                className="w-full px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={
                  isUpdatingSnapshot
                    ? { backgroundColor: 'oklch(0.50 0.05 280)', color: 'oklch(0.98 0.01 280)' }
                    : { backgroundColor: 'oklch(0.45 0.15 290)', color: 'oklch(0.98 0.01 280)' }
                }
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled && !isUpdatingSnapshot) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled && !isUpdatingSnapshot) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                  }
                }}
              >
                {isUpdatingSnapshot ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-camera mr-2"></i>
                    Update Snapshot
                  </>
                )}
              </button>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Creates a new snapshot from the sample droplet and updates the default snapshot ID
              </p>
            </div>

            <div>
              <button
                onClick={handleUpdateDemoWorld}
                disabled={isUpdatingDemoWorld}
                className="w-full px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={
                  isUpdatingDemoWorld
                    ? { backgroundColor: 'oklch(0.50 0.05 280)', color: 'oklch(0.98 0.01 280)' }
                    : { backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid', color: 'oklch(0.98 0.01 280)' }
                }
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled && !isUpdatingDemoWorld) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled && !isUpdatingDemoWorld) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                  }
                }}
              >
                {isUpdatingDemoWorld ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating Demo World...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play-circle mr-2"></i>
                    Update Demo World
                  </>
                )}
              </button>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Syncs the Demo environment with the latest Hyperfy build and reloads the service
              </p>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div 
          className="rounded-lg shadow p-6"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285)',
            borderColor: 'oklch(0.25 0.05 285)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>
            <i className="fas fa-credit-card mr-2" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
            Payment Settings
            {settings.isTestMode && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }}>
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Test Mode Active
              </span>
            )}
          </h3>
          
          <div className="space-y-4">
            {/* Solana Wallet Address */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Solana Wallet Address
              </label>
              <input
                type="text"
                value={settings.solanaWalletAddress}
                onChange={(e) => handleSettingChange('solanaWalletAddress', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 font-mono text-sm"
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
                placeholder="11111111111111111111111111111111"
                maxLength="44"
              />
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>Wallet address to receive Solana payments</p>
            </div>

            {/* Required Withdrawal Amount */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Required Withdrawal Amount (SOL)
              </label>
              <input
                type="number"
                step="0.00001"
                min="0"
                value={settings.requiredWithdrawAmount}
                onChange={(e) => handleSettingChange('requiredWithdrawAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
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
                placeholder="0.33333"
              />
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>Minimum amount required for withdrawal requests (in SOL)</p>
            </div>

            {/* Stripe Public Key */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Stripe Public Key
              </label>
              <input
                type="text"
                value={settings.stripePublicKey}
                onChange={(e) => handleSettingChange('stripePublicKey', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 font-mono text-sm"
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
                placeholder="pk_test_..."
                maxLength="1000"
              />
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>Stripe publishable key (starts with pk_)</p>
            </div>

            {/* Stripe Secret Key */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Stripe Secret Key
              </label>
              <input
                type="password"
                value={settings.stripeSecretKey}
                onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 font-mono text-sm"
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
                placeholder="sk_test_..."
                maxLength="1000"
              />
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>Stripe secret key (starts with sk_) - Keep secure!</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Stripe Mode
              </label>
              <div className="flex items-center space-x-4">
                <label className={`flex items-center ${settings.isTestMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="stripeMode"
                    value="test"
                    checked={settings.stripeMode === 'test'}
                    onChange={(e) => !settings.isTestMode && handleSettingChange('stripeMode', e.target.value)}
                    disabled={settings.isTestMode}
                    className="mr-2"
                    style={{ accentColor: 'oklch(0.45 0.15 290)' }}
                  />
                  <span className="text-sm" style={{ color: settings.isTestMode ? 'oklch(0.50 0.05 280)' : 'oklch(0.98 0.01 280)' }}>Test Mode</span>
                </label>
                <label className={`flex items-center ${settings.isTestMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="stripeMode"
                    value="live"
                    checked={settings.stripeMode === 'live'}
                    onChange={(e) => !settings.isTestMode && handleSettingChange('stripeMode', e.target.value)}
                    disabled={settings.isTestMode}
                    className="mr-2"
                    style={{ accentColor: 'oklch(0.45 0.15 290)' }}
                  />
                  <span className="text-sm" style={{ color: settings.isTestMode ? 'oklch(0.50 0.05 280)' : 'oklch(0.98 0.01 280)' }}>Live Mode</span>
                </label>
              </div>
              {settings.isTestMode && (
                <p className="text-xs mt-1" style={{ color: 'oklch(0.85 0.18 130)' }}>
                  <i className="fas fa-info-circle mr-1"></i>
                  Payment settings are locked to test mode when test mode is enabled
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Solana Network
              </label>
              <div className="flex items-center space-x-4">
                <label className={`flex items-center ${settings.isTestMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="solanaMode"
                    value="devnet"
                    checked={settings.solanaMode === 'devnet'}
                    onChange={(e) => !settings.isTestMode && handleSettingChange('solanaMode', e.target.value)}
                    disabled={settings.isTestMode}
                    className="mr-2"
                    style={{ accentColor: 'oklch(0.45 0.15 290)' }}
                  />
                  <span className="text-sm" style={{ color: settings.isTestMode ? 'oklch(0.50 0.05 280)' : 'oklch(0.98 0.01 280)' }}>Devnet</span>
                </label>
                <label className={`flex items-center ${settings.isTestMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="solanaMode"
                    value="mainnet"
                    checked={settings.solanaMode === 'mainnet'}
                    onChange={(e) => !settings.isTestMode && handleSettingChange('solanaMode', e.target.value)}
                    disabled={settings.isTestMode}
                    className="mr-2"
                    style={{ accentColor: 'oklch(0.45 0.15 290)' }}
                  />
                  <span className="text-sm" style={{ color: settings.isTestMode ? 'oklch(0.50 0.05 280)' : 'oklch(0.98 0.01 280)' }}>Mainnet</span>
                </label>
              </div>
              {settings.isTestMode && (
                <p className="text-xs mt-1" style={{ color: 'oklch(0.85 0.18 130)' }}>
                  <i className="fas fa-info-circle mr-1"></i>
                  Solana network is locked to devnet when test mode is enabled
                </p>
              )}
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Test Mode Toggle</h4>
                  <p className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>Enable test mode for all operations</p>
                </div>
                <button
                  onClick={() => handleSettingChange('isTestMode', !settings.isTestMode)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{
                    backgroundColor: settings.isTestMode ? 'oklch(0.45 0.15 290)' : 'oklch(0.25 0.05 285)'
                  }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{
                      transform: settings.isTestMode ? 'translateX(1.5rem)' : 'translateX(0.25rem)'
                    }}
                  />
                </button>
              </div>
              {settings.isTestMode && (
                <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.1)', borderColor: 'oklch(0.85 0.18 130 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-triangle mt-0.5 mr-2" style={{ color: 'oklch(0.85 0.18 130)' }}></i>
                    <div className="text-xs" style={{ color: 'oklch(0.85 0.18 130)' }}>
                      <p className="font-medium">Test Mode Active</p>
                      <p>All payment settings are automatically set to test mode and cannot be changed while test mode is enabled.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <div 
        className="rounded-lg shadow p-6"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <h3 className="text-lg font-medium mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>
          <i className="fas fa-download mr-2" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
          Export Reports
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExportReport('users')}
            className="flex items-center justify-center px-4 py-3 border rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.18 0.05 285)',
              borderColor: 'oklch(0.25 0.05 285)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
            }}
          >
            <div className="text-center">
              <i className="fas fa-users text-2xl mb-2" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
              <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Users Report</div>
              <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>CSV Export</div>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('droplets')}
            className="flex items-center justify-center px-4 py-3 border rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.18 0.05 285)',
              borderColor: 'oklch(0.25 0.05 285)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
            }}
          >
            <div className="text-center">
              <i className="fas fa-server text-2xl mb-2" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
              <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Droplets Report</div>
              <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>CSV Export</div>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('payments')}
            className="flex items-center justify-center px-4 py-3 border rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.18 0.05 285)',
              borderColor: 'oklch(0.25 0.05 285)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
            }}
          >
            <div className="text-center">
              <i className="fas fa-credit-card text-2xl mb-2" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
              <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Payments Report</div>
              <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>CSV Export</div>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('logs')}
            className="flex items-center justify-center px-4 py-3 border rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.18 0.05 285)',
              borderColor: 'oklch(0.25 0.05 285)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
            }}
          >
            <div className="text-center">
              <i className="fas fa-chart-line text-2xl mb-2" style={{ color: 'oklch(0.85 0.18 130)' }}></i>
              <div className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Logs Report</div>
              <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>CSV Export</div>
            </div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div 
        className="rounded-lg shadow p-6"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <h3 className="text-lg font-medium mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>
          <i className="fas fa-heartbeat mr-2" style={{ color: 'oklch(0.55 0.22 25)' }}></i>
          System Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.1)' }}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
                <i className="fas fa-check" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.70 0.15 150)' }}>API Server</p>
              <p className="text-xs" style={{ color: 'oklch(0.70 0.15 150)' }}>Online</p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.1)' }}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
                <i className="fas fa-check" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.70 0.15 150)' }}>Database</p>
              <p className="text-xs" style={{ color: 'oklch(0.70 0.15 150)' }}>Connected</p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.1)' }}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
                <i className="fas fa-check" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium" style={{ color: 'oklch(0.70 0.15 150)' }}>DigitalOcean API</p>
              <p className="text-xs" style={{ color: 'oklch(0.70 0.15 150)' }}>Connected</p>
            </div>
          </div>
        </div>

        {/* Current Operational Mode */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
          <h4 className="text-sm font-medium mb-3" style={{ color: 'oklch(0.98 0.01 280)' }}>Current Operational Mode</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>Test Mode:</span>
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={
                  settings.isTestMode 
                    ? { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }
                    : { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
                }
              >
                {settings.isTestMode ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>Stripe Mode:</span>
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={
                  settings.isTestMode || settings.stripeMode === 'test'
                    ? { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }
                    : { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
                }
              >
                {settings.isTestMode ? 'TEST (Forced)' : settings.stripeMode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>Solana Network:</span>
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={
                  settings.isTestMode || settings.solanaMode === 'devnet'
                    ? { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }
                    : { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }
                }
              >
                {settings.isTestMode ? 'DEVNET (Forced)' : settings.solanaMode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}>
                {settings.isTestMode ? 'TESTING' : 'PRODUCTION'}
              </span>
            </div>
          </div>
          {settings.isTestMode && (
            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.1)', borderColor: 'oklch(0.85 0.18 130 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
              <div className="flex items-start">
                <i className="fas fa-info-circle mt-0.5 mr-2" style={{ color: 'oklch(0.85 0.18 130)' }}></i>
                <div className="text-xs" style={{ color: 'oklch(0.85 0.18 130)' }}>
                  <p className="font-medium">Test Mode Active</p>
                  <p>All payments and operations are now running in test mode. No real transactions will occur.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsConfigs; 