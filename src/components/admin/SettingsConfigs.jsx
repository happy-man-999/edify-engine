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
    stripeSecretKey: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Settings & Configs</h2>
          <p className="text-sm text-gray-600">Manage system configuration and export reports</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className={`px-4 py-2 rounded-lg transition-colors ${
              saving 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <i className="fas fa-save mr-2"></i>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          
          <button 
            onClick={handleRefreshStripe}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh Stripe
          </button>

          <button 
            onClick={handleTestModeStatus}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <i className="fas fa-vial mr-2"></i>
            Test Mode Status
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <i className="fas fa-server mr-2 text-blue-600"></i>
            Infrastructure Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Snapshot ID
              </label>
              <input
                type="number"
                value={settings.defaultSnapshotId}
                onChange={(e) => handleSettingChange('defaultSnapshotId', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123456"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Base image snapshot ID for new droplets</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default DNS Domain
              </label>
              <input
                type="text"
                value={settings.defaultDnsDomain}
                onChange={(e) => handleSettingChange('defaultDnsDomain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="edifyengine.com"
              />
              <p className="text-xs text-gray-500 mt-1">Default domain for droplet subdomains</p>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <i className="fas fa-credit-card mr-2 text-green-600"></i>
            Payment Settings
            {settings.isTestMode && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Test Mode Active
              </span>
            )}
          </h3>
          
          <div className="space-y-4">
            {/* Solana Wallet Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solana Wallet Address
              </label>
              <input
                type="text"
                value={settings.solanaWalletAddress}
                onChange={(e) => handleSettingChange('solanaWalletAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="11111111111111111111111111111111"
                maxLength="44"
              />
              <p className="text-xs text-gray-500 mt-1">Wallet address to receive Solana payments</p>
            </div>

            {/* Stripe Public Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Public Key
              </label>
              <input
                type="text"
                value={settings.stripePublicKey}
                onChange={(e) => handleSettingChange('stripePublicKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="pk_test_..."
                maxLength="1000"
              />
              <p className="text-xs text-gray-500 mt-1">Stripe publishable key (starts with pk_)</p>
            </div>

            {/* Stripe Secret Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Secret Key
              </label>
              <input
                type="password"
                value={settings.stripeSecretKey}
                onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="sk_test_..."
                maxLength="1000"
              />
              <p className="text-xs text-gray-500 mt-1">Stripe secret key (starts with sk_) - Keep secure!</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  />
                  <span className={`text-sm ${settings.isTestMode ? 'text-gray-400' : 'text-gray-700'}`}>Test Mode</span>
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
                  />
                  <span className={`text-sm ${settings.isTestMode ? 'text-gray-400' : 'text-gray-700'}`}>Live Mode</span>
                </label>
              </div>
              {settings.isTestMode && (
                <p className="text-xs text-yellow-600 mt-1">
                  <i className="fas fa-info-circle mr-1"></i>
                  Payment settings are locked to test mode when test mode is enabled
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  />
                  <span className={`text-sm ${settings.isTestMode ? 'text-gray-400' : 'text-gray-700'}`}>Devnet</span>
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
                  />
                  <span className={`text-sm ${settings.isTestMode ? 'text-gray-400' : 'text-gray-700'}`}>Mainnet</span>
                </label>
              </div>
              {settings.isTestMode && (
                <p className="text-xs text-yellow-600 mt-1">
                  <i className="fas fa-info-circle mr-1"></i>
                  Solana network is locked to devnet when test mode is enabled
                </p>
              )}
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Test Mode Toggle</h4>
                  <p className="text-xs text-gray-500">Enable test mode for all operations</p>
                </div>
                <button
                  onClick={() => handleSettingChange('isTestMode', !settings.isTestMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.isTestMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.isTestMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {settings.isTestMode && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5 mr-2"></i>
                    <div className="text-xs text-yellow-800">
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
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <i className="fas fa-download mr-2 text-purple-600"></i>
          Export Reports
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleExportReport('users')}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <i className="fas fa-users text-2xl text-blue-600 mb-2"></i>
              <div className="text-sm font-medium text-gray-900">Users Report</div>
              <div className="text-xs text-gray-500">CSV Export</div>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('droplets')}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <i className="fas fa-server text-2xl text-green-600 mb-2"></i>
              <div className="text-sm font-medium text-gray-900">Droplets Report</div>
              <div className="text-xs text-gray-500">CSV Export</div>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('payments')}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <i className="fas fa-credit-card text-2xl text-purple-600 mb-2"></i>
              <div className="text-sm font-medium text-gray-900">Payments Report</div>
              <div className="text-xs text-gray-500">CSV Export</div>
            </div>
          </button>

          <button
            onClick={() => handleExportReport('logs')}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <i className="fas fa-chart-line text-2xl text-orange-600 mb-2"></i>
              <div className="text-sm font-medium text-gray-900">Logs Report</div>
              <div className="text-xs text-gray-500">CSV Export</div>
            </div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <i className="fas fa-heartbeat mr-2 text-red-600"></i>
          System Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">API Server</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Database</p>
              <p className="text-xs text-green-600">Connected</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">DigitalOcean API</p>
              <p className="text-xs text-green-600">Connected</p>
            </div>
          </div>
        </div>

        {/* Current Operational Mode */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Current Operational Mode</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Test Mode:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                settings.isTestMode 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {settings.isTestMode ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Stripe Mode:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                settings.isTestMode || settings.stripeMode === 'test'
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {settings.isTestMode ? 'TEST (Forced)' : settings.stripeMode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Solana Network:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                settings.isTestMode || settings.solanaMode === 'devnet'
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {settings.isTestMode ? 'DEVNET (Forced)' : settings.solanaMode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {settings.isTestMode ? 'TESTING' : 'PRODUCTION'}
              </span>
            </div>
          </div>
          {settings.isTestMode && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-yellow-600 mt-0.5 mr-2"></i>
                <div className="text-xs text-yellow-800">
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