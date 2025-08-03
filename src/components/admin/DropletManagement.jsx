import React, { useState } from 'react';

const DropletManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const mockDroplets = [
    {
      id: 'droplet-123',
      name: 'edify-server-001',
      ip: '192.168.1.100',
      createdAt: '2024-01-15T10:30:00Z',
      project: 'Edify Engine',
      status: 'live',
      linkedUser: 'John Doe',
      userId: 1,
      region: 'nyc1',
      size: 's-1vcpu-1gb',
      cost: 5.00
    },
    {
      id: 'droplet-456',
      name: 'edify-server-002',
      ip: '192.168.1.101',
      createdAt: '2024-01-10T14:20:00Z',
      project: 'Edify Engine',
      status: 'provisioning',
      linkedUser: 'Jane Smith',
      userId: 2,
      region: 'nyc1',
      size: 's-1vcpu-1gb',
      cost: 5.00
    },
    {
      id: 'droplet-789',
      name: 'edify-server-003',
      ip: '192.168.1.102',
      createdAt: '2024-01-05T09:15:00Z',
      project: 'Edify Engine',
      status: 'terminated',
      linkedUser: 'Bob Wilson',
      userId: 3,
      region: 'nyc1',
      size: 's-1vcpu-1gb',
      cost: 0.00
    },
    {
      id: 'droplet-101',
      name: 'edify-server-004',
      ip: '192.168.1.103',
      createdAt: '2024-01-20T16:45:00Z',
      project: 'Edify Engine',
      status: 'error',
      linkedUser: 'Alice Johnson',
      userId: 4,
      region: 'nyc1',
      size: 's-1vcpu-1gb',
      cost: 5.00
    }
  ];

  const filteredDroplets = mockDroplets.filter(droplet => {
    const matchesSearch = droplet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         droplet.ip.includes(searchTerm) ||
                         droplet.linkedUser.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || droplet.status === filterStatus;
    const matchesProject = filterProject === 'all' || droplet.project === filterProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'provisioning':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (action, dropletId) => {
    console.log(`${action} droplet: ${dropletId}`);
    // Implement actual API calls here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Droplet Management</h2>
          <p className="text-sm text-gray-600">Manage all provisioned droplets and their status</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-download mr-2"></i>
            Export CSV
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <i className="fas fa-plus mr-2"></i>
            Create Droplet
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-server text-green-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Droplets</p>
              <p className="text-2xl font-semibold text-gray-900">{mockDroplets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-green-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Live</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockDroplets.filter(d => d.status === 'live').length}
              </p>
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
              <p className="text-sm font-medium text-gray-500">Provisioning</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockDroplets.filter(d => d.status === 'provisioning').length}
              </p>
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
              <p className="text-sm font-medium text-gray-500">Errors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockDroplets.filter(d => d.status === 'error').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Droplets
            </label>
            <input
              type="text"
              placeholder="Search by name, IP, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="provisioning">Provisioning</option>
              <option value="terminated">Terminated</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects</option>
              <option value="Edify Engine">Edify Engine</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <i className="fas fa-filter mr-2"></i>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Droplets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Droplets ({filteredDroplets.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Droplet Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linked User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDroplets.map((droplet) => (
                <tr key={droplet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{droplet.name}</div>
                      <div className="text-sm text-gray-500">{droplet.ip}</div>
                      <div className="text-xs text-gray-400">{droplet.size} • {droplet.region}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(droplet.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{droplet.linkedUser}</div>
                    <div className="text-xs text-gray-500">ID: {droplet.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(droplet.status)}`}>
                      {droplet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${droplet.cost.toFixed(2)}/month
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleAction('view', droplet.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {droplet.status === 'live' && (
                        <>
                          <button 
                            onClick={() => handleAction('restart', droplet.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Restart"
                          >
                            <i className="fas fa-redo"></i>
                          </button>
                          <button 
                            onClick={() => handleAction('terminate', droplet.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Terminate"
                          >
                            <i className="fas fa-stop"></i>
                          </button>
                        </>
                      )}
                      {droplet.status === 'error' && (
                        <button 
                          onClick={() => handleAction('reprovision', droplet.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Reprovision"
                        >
                          <i className="fas fa-sync"></i>
                        </button>
                      )}
                      <button 
                        onClick={() => handleAction('delete', droplet.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
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

export default DropletManagement; 