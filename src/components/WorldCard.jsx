import React, { useState } from 'react';
import { useDroplets } from '../hooks/useDroplets';

const WorldCard = ({ world, onRefresh }) => {
  const { syncDroplet } = useDroplets();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleCardClick = () => {
    if (world.name && world.status === 'active') {
      // Open domain in new tab for active droplets
      window.open(`https://${world.name}.edifyengine.com`, '_blank');
    } else if (world.status === 'new' || world.status === 'off') {
      // For new/off droplets, show info or navigate to management
      console.log('Droplet is still being created or offline');
    }
  };

  // Get background color based on status
  const getBackgroundColor = () => {
    switch (world.status) {
      case 'active':
        return '#10b981'; // Green for active
      case 'new':
        return '#3b82f6'; // Blue for new
      case 'off':
        return '#f59e0b'; // Yellow for off
      default:
        return '#667eea'; // Default blue
    }
  };

  // Get status-specific content
  const getStatusContent = () => {
    if (world.status === 'active' && world.name) {
      return {
        title: world.name,
        subtitle: 'Click to visit',
        clickable: true
      };
    } else if (world.status === 'new') {
      return {
        title: world.name || 'Creating...',
        subtitle: 'Setting up your world',
        clickable: false
      };
    } else if (world.status === 'off') {
      return {
        title: world.name || 'Offline',
        subtitle: 'World is currently offline',
        clickable: false
      };
    } else {
      return {
        title: world.name || 'Unknown',
        subtitle: 'Status: ' + world.status,
        clickable: false
      };
    }
  };

  const statusContent = getStatusContent();
  const isClickable = statusContent.clickable;

  const handleSyncClick = async (e) => {
    e.stopPropagation();
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const result = await syncDroplet(world.dropletId);
      if (result.success && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error syncing droplet:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleVisitClick = (e) => {
    e.stopPropagation();
    if (world.name && world.status === 'active') {
      window.open(`https://${world.name}.edifyengine.com`, '_blank');
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`professional-card h-48 relative overflow-hidden transition-all duration-300 group ${
        isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'cursor-default'
      }`}
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
        world.status === 'active' 
          ? 'bg-gradient-to-br from-green-600/30 to-green-700/30 group-hover:from-green-500/20 group-hover:to-green-600/20'
          : world.status === 'new'
          ? 'bg-gradient-to-br from-blue-600/30 to-blue-700/30'
          : world.status === 'off'
          ? 'bg-gradient-to-br from-yellow-600/30 to-yellow-700/30'
          : 'bg-gradient-to-br from-blue-600/30 to-purple-700/30'
      }`}></div>
      
      {/* Main content display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="text-xl font-bold mb-2 drop-shadow-lg font-mono">
            {statusContent.title}
          </h3>
          <p className="text-sm opacity-90 drop-shadow-md">
            {statusContent.subtitle}
          </p>
          
          {/* Show additional info for non-active droplets */}
          {world.status !== 'active' && (
            <div className="mt-3 text-xs opacity-75">
              <p>Created: {new Date(world.createdAt).toLocaleDateString()}</p>
              {world.specs && (
                <p>{world.specs.memory}GB RAM, {world.specs.vcpus} vCPU</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white shadow-lg ${
          world.status === 'active' ? 'bg-green-500' :
          world.status === 'new' ? 'bg-blue-500' :
          world.status === 'off' ? 'bg-yellow-500' :
          'bg-gray-500'
        }`}>
          {world.status}
        </span>
      </div>

      {/* Hover effect overlay - only for clickable cards */}
      {isClickable && (
        <>
          <div className="absolute inset-0 bg-white bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300 rounded-lg"></div>
        </>
      )}
      
      {/* Non-clickable indicator */}
      {!isClickable && (
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]"></div>
      )}

      {/* Hover Action Buttons */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        {/* Subtle background overlay for better button visibility */}
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="flex gap-3 relative z-10">
          {/* Visit Button */}
          {world.status === 'active' && world.name && (
            <button
              onClick={handleVisitClick}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-white/40 hover:border-white/50 transition-all duration-200 shadow-lg hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Visit World"
              aria-label="Visit World"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
          
          {/* Sync Button */}
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-white/40 hover:border-white/50 transition-all duration-200 shadow-lg hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-white/50 ${
              isSyncing ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
            }`}
            title="Sync Status"
            aria-label="Sync Droplet Status"
          >
            {isSyncing ? (
              <i className="fas fa-sync fa-spin text-lg"></i>
            ) : (
              <i className="fas fa-sync text-lg"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorldCard; 