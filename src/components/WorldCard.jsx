import React, { useState } from 'react';
import { useDroplets } from '../hooks/useDroplets';
import { useDeleteWorld } from '../hooks/useDeleteWorld';
import { useYesNoModal } from '../hooks/useYesNoModal';
import { useEditorModal } from '../hooks/useEditorModal';

const WorldCard = ({ world, onRefresh, onCustomDomainUpsell }) => {
  const { syncDroplet, restartDroplet } = useDroplets();
  const { deleteWorld, isDeleting } = useDeleteWorld();
  const { showModal } = useYesNoModal();
  const { showModal: showEditorModal } = useEditorModal();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleCardClick = () => {
    if (world.name && world.status === 'active') {
      // Open domain in new tab for active droplets
      window.open(world.customDomain 
        ? `https://${world.customDomain}`
        : `https://${world.subdomain}.edifyengine.com`, '_blank');
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
        subtitle: <p>Click to visit</p>,
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
      // Check if name is a full domain (contains dots) or just a subdomain
      const url = world.customDomain
        ? `https://${world.customDomain}` 
        : `https://${world.subdomain}.edifyengine.com`;
      window.open(url, '_blank');
    }
  };

  const handleRestartClick = async (e) => {
    e.stopPropagation();
    if (isRestarting) return;
    
    const yesNoResult = await showModal(`Are you sure you want to restart "${world.name || 'this world'}"? This will temporarily take the world offline while it restarts.`);
    if (yesNoResult) {
      setIsRestarting(true);
      try {
        const result = await restartDroplet(world.dropletId);
        if (result.success && onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('Error restarting droplet:', error);
      } finally {
        setIsRestarting(false);
      }
    }
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    const yesNoResult = await showModal(`Are you sure you want to delete "${world.name || 'this world'}"? This action cannot be undone and will permanently remove the world and all its data.`);
    if (yesNoResult) {
      const result = await deleteWorld(world.dropletId);
      if (result.success && onRefresh) {
        onRefresh();
      }
    }
  };

  const handleEditorClick = (e) => {
    e.stopPropagation();
    showEditorModal(world.customDomain ? world.customDomain : world.subdomain + ".edifyengine.com");
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
          <br />
          {world.status === 'active' && 
            <p className="text-3xl opacity-90 drop-shadow-md">
              World
            </p>
          }
          
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

          {/* Restart Button */}
          {world.status === 'active' && world.name && (<button
            onClick={handleRestartClick}
            disabled={isRestarting}
            className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-white/40 hover:border-white/50 transition-all duration-200 shadow-lg hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-white/50 ${
              isRestarting ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
            }`}
            title="Restart World"
            aria-label="Restart World"
          >
            {isRestarting ? (
              <i className="fas fa-redo fa-spin text-lg"></i>
            ) : (
              <i className="fas fa-redo text-lg"></i>
            )}
          </button>)}

          {/* Editor Button */}
          {world.status === 'active' && world.name && (
            <button
              onClick={handleEditorClick}
              className="bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full p-3 text-white hover:bg-purple-500/40 hover:border-purple-400/50 transition-all duration-200 shadow-lg hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              title="Open Editor"
              aria-label="Open VSCode Editor"
            >
              <i className="fas fa-code text-lg"></i>
            </button>
          )}

          {/* Custom Domain Upsell Button */}
          {world.status === 'active' && world.name && onCustomDomainUpsell && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCustomDomainUpsell();
              }}
              className={`backdrop-blur-sm border rounded-full p-3 text-white hover:bg-white/40 hover:border-white/50 transition-all duration-200 shadow-lg hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-white/50 ${
                world.customDomainPaid 
                  ? 'bg-green-500/20 border-green-400/30 hover:bg-green-500/40' 
                  : 'bg-white/20 border-white/30'
              }`}
              title={world.customDomainPaid ? 'Configure Custom Domain' : 'Upgrade to Custom Domain ($2.99)'}
              aria-label={world.customDomainPaid ? 'Configure Custom Domain' : 'Upgrade to Custom Domain'}
            >
              <i className={`fas ${world.customDomainPaid ? 'fa-globe' : 'fa-crown'} text-lg`}></i>
            </button>
          )}

          {/* Delete Button */}
          {world.status === 'active' && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className={`bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full p-3 text-white hover:bg-red-500/40 hover:border-red-400/50 transition-all duration-200 shadow-lg hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-red-400/50 ${
                isDeleting ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
              }`}
              title="Delete World"
              aria-label="Delete World"
            >
              {isDeleting ? (
                <i className="fas fa-spinner fa-spin text-lg"></i>
              ) : (
                <i className="fas fa-trash text-lg"></i>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorldCard; 