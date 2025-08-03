import React, { useState } from 'react';

const SettingsConfigs = () => {
  const [settings, setSettings] = useState({
    defaultSnapshotId: 'snapshot-123456',
    defaultDropletPlan: 's-1vcpu-1gb',
    stripeMode: 'live',
    solanaMode: 'mainnet',
    defaultDns: 'edifyengine.com',
    defaultSubdomain: 'app'
  });

  const [isTestMode, setIsTestMode] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Implement save logic
  };

  const handleExportReport = (type) => {
    console.log(`Exporting ${type} report`);
    // Implement export logic
  };

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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-save mr-2"></i>
            Save Settings
          </button>
        </div>
      </div>

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
                type="text"
                value={settings.defaultSnapshotId}
                onChange={(e) => handleSettingChange('defaultSnapshotId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="snapshot-123456"
              />
              <p className="text-xs text-gray-500 mt-1">Base image snapshot for new droplets</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Droplet Plan
              </label>
              <select
                value={settings.defaultDropletPlan}
                onChange={(e) => handleSettingChange('defaultDropletPlan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="s-1vcpu-1gb">s-1vcpu-1gb ($5/month)</option>
                <option value="s-1vcpu-2gb">s-1vcpu-2gb ($10/month)</option>
                <option value="s-2vcpu-2gb">s-2vcpu-2gb ($15/month)</option>
                <option value="s-2vcpu-4gb">s-2vcpu-4gb ($20/month)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default DNS Domain
              </label>
              <input
                type="text"
                value={settings.defaultDns}
                onChange={(e) => handleSettingChange('defaultDns', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="edifyengine.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Subdomain
              </label>
              <input
                type="text"
                value={settings.defaultSubdomain}
                onChange={(e) => handleSettingChange('defaultSubdomain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="app"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <i className="fas fa-credit-card mr-2 text-green-600"></i>
            Payment Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Mode
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stripeMode"
                    value="test"
                    checked={settings.stripeMode === 'test'}
                    onChange={(e) => handleSettingChange('stripeMode', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Test Mode</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stripeMode"
                    value="live"
                    checked={settings.stripeMode === 'live'}
                    onChange={(e) => handleSettingChange('stripeMode', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Live Mode</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solana Network
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="solanaMode"
                    value="devnet"
                    checked={settings.solanaMode === 'devnet'}
                    onChange={(e) => handleSettingChange('solanaMode', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Devnet</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="solanaMode"
                    value="mainnet"
                    checked={settings.solanaMode === 'mainnet'}
                    onChange={(e) => handleSettingChange('solanaMode', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Mainnet</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Test Mode Toggle</h4>
                  <p className="text-xs text-gray-500">Enable test mode for all operations</p>
                </div>
                <button
                  onClick={() => setIsTestMode(!isTestMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isTestMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isTestMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
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
      </div>
    </div>
  );
};

export default SettingsConfigs; 