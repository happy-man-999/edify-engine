import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';
import { useYesNoModal } from '../hooks/useYesNoModal';
import { useErrorModal } from '../hooks/useErrorModal';

const SnapshotCard = ({ snapshot, onRefresh }) => {
  const dispatch = useDispatch();
  const { showModal } = useYesNoModal();
  const { showError } = useErrorModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    
    const yesNoResult = await showModal(`Are you sure you want to delete the snapshot "${snapshot.name}"? This action cannot be undone.`);
    if (yesNoResult) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/user/snapshots/${snapshot.snapshotId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          dispatch(showNotification('Snapshot deleted successfully!'));
          if (onRefresh) {
            onRefresh();
          }
        } else {
          showError('Failed to delete snapshot: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting snapshot:', error);
        showError('Failed to delete snapshot: ' + error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Get background color based on status
  const getBackgroundColor = () => {
    switch (snapshot.status) {
      case 'available':
        return '#10b981'; // Green for available
      case 'pending':
        return '#3b82f6'; // Blue for pending
      default:
        return '#667eea'; // Default blue
    }
  };

  return (
    <div 
      className="professional-card h-48 relative overflow-hidden transition-all duration-300 group"
      style={{
        backgroundColor: getBackgroundColor()
      }}
    >
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 2px, transparent 2px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>
      
      {/* Status-based overlay for better text readability */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        snapshot.status === 'available' 
          ? 'bg-gradient-to-br from-green-600/30 to-green-700/30'
          : snapshot.status === 'pending'
          ? 'bg-gradient-to-br from-blue-600/30 to-blue-700/30'
          : 'bg-gradient-to-br from-blue-600/30 to-purple-700/30'
      }`}></div>
      
      {/* Main content display */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="text-center text-white w-full">
          <div className="flex items-center justify-center mb-2">
            <i className="fas fa-database text-2xl mr-2"></i>
            <h3 className="text-lg font-bold drop-shadow-lg font-mono truncate">
              {snapshot.name}
            </h3>
          </div>
          
          <div className="mt-3 text-xs opacity-90 space-y-1">
            <p className="flex items-center justify-center">
              <i className="fas fa-calendar-alt mr-2"></i>
              {new Date(snapshot.createdAt).toLocaleDateString()}
            </p>
            {snapshot.sizeGigabytes && (
              <p className="flex items-center justify-center">
                <i className="fas fa-hdd mr-2"></i>
                {snapshot.sizeGigabytes} GB
              </p>
            )}
            {snapshot.description && (
              <p className="text-xs opacity-75 mt-2 truncate px-4">
                {snapshot.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white shadow-lg ${
          snapshot.status === 'available' ? 'bg-green-500' :
          snapshot.status === 'pending' ? 'bg-blue-500' :
          'bg-gray-500'
        }`}>
          {snapshot.status}
        </span>
      </div>

      {/* Hover Action Buttons */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        {/* Subtle background overlay for better button visibility */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="flex gap-3 relative z-10">
          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={`bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full p-3 text-white hover:bg-red-500/40 hover:border-red-400/50 transition-all duration-200 shadow-lg hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-red-400/50 ${
              isDeleting ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
            }`}
            title="Delete Snapshot"
            aria-label="Delete Snapshot"
          >
            {isDeleting ? (
              <i className="fas fa-spinner fa-spin text-lg"></i>
            ) : (
              <i className="fas fa-trash text-lg"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnapshotCard;

