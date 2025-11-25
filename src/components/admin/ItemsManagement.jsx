import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/uiSlice';
import ThreeDPreviewModal from '../ThreeDPreviewModal';
import ItemEditModal from './ItemEditModal';

const ItemsManagement = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unapproved, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else {
        throw new Error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      dispatch(showNotification('Failed to fetch items', 'error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setItems(prevItems =>
          prevItems.map(item =>
            item._id === itemId ? { ...item, status: newStatus } : item
          )
        );
        dispatch(showNotification(`Item ${newStatus} successfully`, 'success'));
      } else {
        throw new Error('Failed to update item status');
      }
    } catch (error) {
      console.error('Error updating item status:', error);
      dispatch(showNotification('Failed to update item status', 'error'));
    }
  };

  const handlePreviewClick = (item) => {
    setPreviewItem(item);
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewItem(null);
  };

  const handleDownload = (item) => {
    // Handle download functionality for admin
    dispatch(showNotification('Download functionality for admin coming soon', 'info'));
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleEditSuccess = (updatedItem) => {
    // Update the item in the local state
    setItems(prevItems =>
      prevItems.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
    handleEditClose();
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      unapproved: { backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)', icon: 'fas fa-clock' },
      approved: { backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)', icon: 'fas fa-check-circle' },
      rejected: { backgroundColor: 'oklch(0.55 0.22 25 / 0.2)', color: 'oklch(0.55 0.22 25)', icon: 'fas fa-times-circle' }
    };
    
    const config = statusConfig[status] || statusConfig.unapproved;
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: config.backgroundColor, color: config.color }}>
        <i className={`${config.icon} mr-1`}></i>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      'app': 'fas fa-mobile-alt',
      'bundle': 'fas fa-box',
      'template': 'fas fa-file-alt',
      'world': 'fas fa-globe',
      'asset': 'fas fa-cube',
      'service': 'fas fa-cogs',
      '3d-object': 'fas fa-cube'
    };
    return typeIcons[type] || 'fas fa-file';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
          <p style={{ color: 'oklch(0.65 0.05 280)' }}>Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>Items Management</h2>
          <p style={{ color: 'oklch(0.65 0.05 280)' }}>Manage and approve items submitted by contributors</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={fetchItems}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.45 0.15 290)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
            }}
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div 
        className="rounded-lg p-4"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'oklch(0.50 0.05 280)' }}></i>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2"
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
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2"
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
            >
              <option value="all">All Items</option>
              <option value="unapproved">Unapproved</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)' }}>
              <i className="fas fa-box" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Total Items</p>
              <p className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>{items.length}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)' }}>
              <i className="fas fa-clock" style={{ color: 'oklch(0.85 0.18 130)' }}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Pending Review</p>
              <p className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {items.filter(item => item.status === 'unapproved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
              <i className="fas fa-check-circle" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Approved</p>
              <p className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {items.filter(item => item.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.2)' }}>
              <i className="fas fa-times-circle" style={{ color: 'oklch(0.55 0.22 25)' }}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Rejected</p>
              <p className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {items.filter(item => item.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div 
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-box text-4xl mb-4" style={{ color: 'oklch(0.50 0.05 280)' }}></i>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>No items found</h3>
            <p style={{ color: 'oklch(0.65 0.05 280)' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'No items match the current filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                <tr style={{ borderBottom: '1px solid oklch(0.25 0.05 285)' }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr 
                    key={item._id}
                    style={{
                      backgroundColor: 'oklch(0.18 0.05 285)',
                      borderBottom: '1px solid oklch(0.25 0.05 285)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)'; }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {item.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={item.image}
                              alt={item.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'oklch(0.25 0.05 285)' }}>
                              <i className="fas fa-image" style={{ color: 'oklch(0.50 0.05 280)' }}></i>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium truncate max-w-xs" style={{ color: 'oklch(0.98 0.01 280)' }}>
                            {item.title}
                          </div>
                          <div className="text-sm truncate max-w-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className={`${getTypeIcon(item.type)} mr-2`} style={{ color: 'oklch(0.50 0.05 280)' }}></i>
                        <span className="text-sm capitalize" style={{ color: 'oklch(0.98 0.01 280)' }}>
                          {item.type.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {item.creator?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      ${item.priceUSD.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* 3D Preview Button - Only show for items with sceneAssets */}
                        {item.sceneAssets && (
                          <button
                            onClick={() => handlePreviewClick(item)}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: 'oklch(0.50 0.18 260)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.18 260)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
                            title="3D Preview"
                          >
                            <i className="fas fa-cube"></i>
                          </button>
                        )}
                        
                        {item.status === 'unapproved' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(item._id, 'approved')}
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ color: 'oklch(0.70 0.15 150)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                              title="Approve"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              onClick={() => handleStatusChange(item._id, 'rejected')}
                              className="disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ color: 'oklch(0.55 0.22 25)' }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.60 0.22 25)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.55 0.22 25)'; }}
                              title="Reject"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                        {item.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(item._id, 'unapproved')}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: 'oklch(0.85 0.18 130)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.90 0.18 130)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.85 0.18 130)'; }}
                            title="Unapprove"
                          >
                            <i className="fas fa-undo"></i>
                          </button>
                        )}
                        {item.status === 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(item._id, 'approved')}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: 'oklch(0.70 0.15 150)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'oklch(0.75 0.15 150)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'oklch(0.70 0.15 150)'; }}
                            title="Approve"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        
                        {/* Edit Button - Available for all items */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit Item"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3D Preview Modal */}
      {showPreviewModal && previewItem && (
        <ThreeDPreviewModal
          item={previewItem}
          onClose={handleClosePreview}
          onDownload={handleDownload}
        />
      )}

      {/* Edit Item Modal */}
      {showEditModal && editingItem && (
        <ItemEditModal
          item={editingItem}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default ItemsManagement;
