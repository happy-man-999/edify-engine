import React, { useState } from 'react';

const LogsStatus = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockLogs = [
    {
      id: 1,
      timestamp: '2024-01-20T14:30:00Z',
      level: 'info',
      type: 'webhook',
      message: 'Stripe webhook received: payment_intent.succeeded',
      details: {
        paymentIntent: 'pi_123456789',
        amount: 2999,
        customer: 'cus_123456789'
      },
      status: 'processed'
    },
    {
      id: 2,
      timestamp: '2024-01-20T14:25:00Z',
      level: 'success',
      type: 'provisioning',
      message: 'Droplet created successfully: droplet-123',
      details: {
        dropletId: 'droplet-123',
        ip: '192.168.1.100',
        region: 'nyc1'
      },
      status: 'completed'
    },
    {
      id: 3,
      timestamp: '2024-01-20T14:20:00Z',
      level: 'error',
      type: 'webhook',
      message: 'Failed to process Solana payment',
      details: {
        txHash: '5KJvsngHeMpo884WmTJNhUqbYqjKq6NTjCdu6APLCo1NSHjAhqrS1QnPiVeC7XMoYDn5f9f3KxrJRjVUT5q6s5vPL',
        error: 'Insufficient balance'
      },
      status: 'failed'
    },
    {
      id: 4,
      timestamp: '2024-01-20T14:15:00Z',
      level: 'warning',
      type: 'provisioning',
      message: 'Droplet provisioning taking longer than expected',
      details: {
        dropletId: 'droplet-456',
        elapsedTime: '5m 30s'
      },
      status: 'in_progress'
    }
  ];

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    
    return matchesSearch && matchesType && matchesLevel;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'webhook' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-orange-100 text-orange-800';
  };

  const handleReprocess = (logId) => {
    console.log(`Reprocess log: ${logId}`);
    // Implement reprocessing logic
  };

  const handleReprovision = (logId) => {
    console.log(`Reprovision based on log: ${logId}`);
    // Implement reprovisioning logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Logs & Status</h2>
          <p className="text-sm text-gray-600">Monitor API logs, webhooks, and system status</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-download mr-2"></i>
            Export Logs
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <i className="fas fa-sync mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-bell text-blue-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Webhook Hits</p>
              <p className="text-2xl font-semibold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-server text-green-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Provisioning Success</p>
              <p className="text-2xl font-semibold text-gray-900">89%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Errors (24h)</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">245ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Logs</label>
            <input
              type="text"
              placeholder="Search log messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="webhook">Webhook</option>
              <option value="provisioning">Provisioning</option>
              <option value="payment">Payment</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <i className="fas fa-filter mr-2"></i>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            API Logs ({filteredLogs.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.message}</div>
                    {log.details && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Object.entries(log.details).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === 'completed' || log.status === 'processed'
                        ? 'bg-green-100 text-green-800'
                        : log.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => console.log(`View log details: ${log.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {log.level === 'error' && log.type === 'webhook' && (
                        <button 
                          onClick={() => handleReprocess(log.id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Reprocess Webhook"
                        >
                          <i className="fas fa-redo"></i>
                        </button>
                      )}
                      {log.type === 'provisioning' && log.status === 'failed' && (
                        <button 
                          onClick={() => handleReprovision(log.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Reprovision"
                        >
                          <i className="fas fa-sync"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogsStatus; 