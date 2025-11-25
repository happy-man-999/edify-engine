import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { usePaymentSuccess } from "../hooks/usePaymentSuccess";
import { useErrorModal } from "../hooks/useErrorModal";
import { useUserDroplets } from "../hooks/useUserDroplets";
import { useAuth } from "../hooks/useAuth";
import { useSnapshotSelectionModal } from "../hooks/useSnapshotSelectionModal";
import { shortAddress } from "../utils/format";
import { getWorldLimit, hasReachedWorldLimit as checkWorldLimit } from "../utils/planUtils";
import { showNotification, openDomainModal, hideDomainModal } from "../store/uiSlice";
import WorldCard from "./WorldCard";
import DomainSelectionModal from "./DomainSelectionModal";
import UpgradePlanModal from "./UpgradePlanModal";

/**
 * WorldsSection Component
 * 
 * Features:
 * - Displays user's virtual worlds
 * - Shows informational message when world status changes from 'new' to 'active'
 * - Informational message includes "Don't show again" option with localStorage persistence
 * - Message: "Your world is live - finalizing SSL for secure access. Check back in a couple minutes."
 * 
 * The informational message appears above the worlds grid when:
 * 1. A world status changes from 'new' to 'active'
 * 2. User hasn't previously dismissed it with "Don't show again"
 * 
 * localStorage key: 'worldActiveInfoDismissed'
 */
const WorldActiveInfo = ({ onClose, onDontShowAgain }) => {
  return (
    <div className="rounded-lg p-4 mb-6 relative" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className="fas fa-info-circle text-lg" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>
            Your world is live - finalizing SSL for secure access. Check back in a couple minutes.
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onDontShowAgain}
            className="text-xs underline transition-colors"
            style={{ color: 'oklch(0.45 0.15 290)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'oklch(0.50 0.18 260)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'oklch(0.45 0.15 290)';
            }}
          >
            Don't show again
          </button>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: 'oklch(0.50 0.05 280)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'oklch(0.50 0.05 280)';
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const WorldsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openPaymentModal } = usePaymentModal();
  const { showError } = useErrorModal();
  const { userDroplets, loading, error, refreshUserDroplets } = useUserDroplets();
  const { handleStripePaymentSuccess, handleSolanaPaymentSuccess } = usePaymentSuccess({refreshUserDroplets});
  const { user } = useAuth();
  const { showModal: showSnapshotSelectionModal } = useSnapshotSelectionModal();
  
  // Redux state for domain modal
  const { isOpen: showDomainModal } = useSelector(state => state.ui.domainModal);
  const [selectedCustomDomain, setSelectedCustomDomain] = useState(null);

  // State for showing the informational message
  const [showActiveInfo, setShowActiveInfo] = useState(false);
  const previousDropletsRef = useRef([]);

  // State for showing the upgrade plan modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Check for pending Stripe payment success on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    
    // Check if this is a successful payment return from Stripe
    if (paymentStatus === 'success' && sessionId) {
      handleStripePaymentSuccess(sessionId);
      navigate(location.pathname, { replace: true });
    } else if (paymentStatus === 'cancelled') {
      dispatch(showNotification('Payment was cancelled'));
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, dispatch, navigate, location.pathname]);

  // Check for world status changes and show info message
  useEffect(() => {
    if (!loading && userDroplets.length > 0 && previousDropletsRef.current.length > 0) {
      // Check if any world status changed from 'new' to 'active'
      const hasNewToActiveChange = userDroplets.some((currentDroplet) => {
        const previousDroplet = previousDropletsRef.current.find(p => p.id === currentDroplet.id);
        return previousDroplet && 
               previousDroplet.status === 'new' && 
               currentDroplet.status === 'active';
      });

      if (hasNewToActiveChange) {
        console.log('World status changed from new to active - showing info message');
        // Check if user has dismissed this message permanently
        const dontShowAgain = localStorage.getItem('worldActiveInfoDismissed');
        if (!dontShowAgain) {
          setShowActiveInfo(true);
        } else {
          console.log('User has chosen not to show this message again');
        }
      }
    }
    
    // Update previous droplets for next comparison
    if (!loading && userDroplets.length > 0) {
      previousDropletsRef.current = userDroplets;
    }
  }, [userDroplets, loading]);

  const handleCloseInfo = () => {
    setShowActiveInfo(false);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem('worldActiveInfoDismissed', 'true');
    setShowActiveInfo(false);
  };

  // Function to reset the "Don't show again" preference (useful for testing)
  const resetDontShowAgain = () => {
    localStorage.removeItem('worldActiveInfoDismissed');
  };
  
  const handleCreateWorld = async () => {
    // Check if user has reached the world limit
    if (hasReachedWorldLimit) {
      const limit = getWorldLimit(user?.plan);
      const limitText = limit === null ? 'unlimited' : limit;
      showError(`You have reached the maximum limit of ${limitText} world${limit !== 1 ? 's' : ''}. Please delete an existing world before creating a new one.`);
      return;
    }
    
    // Show snapshot selection modal
    const selectedSnapshotId = await showSnapshotSelectionModal();
    
    // If user cancelled the modal, return
    if (selectedSnapshotId === undefined) {
      return;
    }
    
    // Proceed with normal payment flow
    openPaymentModal({
      amount: 9.99,
      itemName: "New World",
      itemId: "new-world",
      metadata: {
        snapshotId: selectedSnapshotId // null for default, or the snapshot ID
      }
    }).then(async (result) => {
      if (!result || !result.paymentMethod) return;
      
      if (result.paymentMethod === 'stripe') {
        // For Stripe, the redirect will handle the notification
        // Refresh user droplets after successful payment
        setTimeout(() => {
          refreshUserDroplets();
        }, 2000); // Wait a bit for the backend to process
      } else if (result.paymentMethod === 'solana') {
        // For Solana, use the payment success hook for consistent handling
        try {
          await handleSolanaPaymentSuccess(result.signature);
          // Refresh user droplets after successful payment
          setTimeout(() => {
            refreshUserDroplets();
          }, 2000); // Wait a bit for the backend to process
        } catch (error) {
          console.error('Error handling Solana payment success:', error);
          showError('Payment successful, but confirmation failed');
        }
      }
    }).catch((error) => {
      console.error('Payment failed:', error);
      showError(error.message);
    });
  };

  const handleCustomDomainUpsell = async (dropletId) => {
    // Find the world to check if custom domain is already paid
    const world = userDroplets.find(w => w.dropletId === dropletId);
    
    if (world && world.customDomainPaid) {
      // Already paid, show domain selection modal directly
      dispatch(openDomainModal(dropletId));
    } else {
      // Proceed with subscription payment flow
      openPaymentModal({
        amount: 2.99,
        itemName: "Link your own domain name or buy one through us.",
        itemId: "custom-domain",
        subscriptionMode: true,
        metadata: {
          dropletId: dropletId
        }
      }).then(async (result) => {
        if (!result || !result.paymentMethod) return;
        
        if (result.paymentMethod === 'stripe') {
          // For Stripe subscription, the redirect will handle the notification
          // Refresh user droplets after successful payment
          setTimeout(() => {
            refreshUserDroplets();
          }, 2000); // Wait a bit for the backend to process
        }
      }).catch((error) => {
        console.error('Payment failed:', error);
        showError(error.message);
      });
    }
  };

  const markWorldAsCustomDomainPaid = async (dropletId, transactionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/droplets/${dropletId}/custom-domain-paid`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: transactionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('World marked as custom domain paid:', data);
        
        // Refresh the droplets list to update the UI
        refreshUserDroplets();
        
        dispatch(showNotification('Custom domain upgrade successful!'));
      } else {
        throw new Error('Failed to mark world as custom domain paid');
      }
    } catch (error) {
      console.error('Error marking world as custom domain paid:', error);
      throw error;
    }
  };

  const handleUpgradePlan = () => {
    setShowUpgradeModal(true);
  };

  // Check if user has reached the world limit
  const dropletLimit = !user ? 0 : getWorldLimit(user.plan) ?? Infinity;
  const hasReachedWorldLimit = !user || (dropletLimit !== null && userDroplets.length >= dropletLimit);
  const remainingWorlds = !user ? 0 : (dropletLimit === null ? Infinity : Math.max(0, dropletLimit - userDroplets.length));

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>Your Worlds</h2>
          {!loading && !error && (
            <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
              {userDroplets.length} of {dropletLimit === null ? 'Unlimited' : dropletLimit} worlds created
              {remainingWorlds > 0 && remainingWorlds !== Infinity && ` • ${remainingWorlds} remaining`}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshUserDroplets}
            disabled={loading}
            className="transition-colors duration-300 disabled:cursor-not-allowed"
            style={{ color: loading ? 'oklch(0.50 0.05 280)' : 'oklch(0.50 0.18 260)' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.color = 'oklch(0.45 0.15 290)'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.color = 'oklch(0.50 0.18 260)'; }}
            title="Refresh worlds"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>
      
      {/* Informational message for world status changes */}
      {showActiveInfo && (
        <WorldActiveInfo
          onClose={handleCloseInfo}
          onDontShowAgain={handleDontShowAgain}
        />
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="professional-card animate-pulse">
              <div className="h-4 rounded mb-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}></div>
              <div className="h-3 rounded mb-2" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}></div>
              <div className="h-3 rounded mb-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}></div>
              <div className="h-3 rounded mb-2" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}></div>
              <div className="h-3 rounded mb-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}></div>
              <div className="h-8 rounded" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}></div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load your worlds: {error}</p>
          <button
            onClick={refreshUserDroplets}
            className="bg-[#42677D] text-white px-4 py-2 rounded-md hover:bg-[#5E8EA9] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Worlds grid - only show when there are existing worlds */}
      {!loading && !error && userDroplets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* All existing worlds */}
          {userDroplets.map((world) => (
            <WorldCard 
              key={world.id} 
              world={world} 
              onRefresh={refreshUserDroplets}
              onCustomDomainUpsell={() => handleCustomDomainUpsell(world.dropletId)}
            />
          ))}
          
          {/* Create New World button or Upgrade Plan button */}
          {hasReachedWorldLimit ? (
            // Upgrade Plan Button
            <div 
              onClick={handleUpgradePlan}
              className="professional-card border-2 border-dashed border-[#42677D] bg-gradient-to-br from-[#42677D]/5 to-[#5E8EA9]/5 transition-all duration-300 flex flex-col items-center justify-center p-8 relative overflow-hidden cursor-pointer hover:shadow-lg hover:from-[#42677D]/10 hover:to-[#5E8EA9]/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#42677D]/5 to-[#5E8EA9]/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10 bg-[#42677D]/10">
                <i className="fas fa-arrow-up text-[#42677D] text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1 relative z-10 text-[#42677D]">
                {user ? 'Upgrade Plan' : 'Choose Plan'}
              </h3>
              <p className="text-sm text-center relative z-10 text-[#42677D]">
                {user 
                  ? 'Unlock more worlds and expand your universe'
                  : 'Select a plan to start building your virtual worlds'
                }
              </p>
            </div>
          ) : (
            // Create New World Button or Sign In Button
            <div 
              onClick={user ? handleCreateWorld : () => navigate('/auth')} 
              className="professional-card border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 relative overflow-hidden cursor-pointer"
              style={{ borderColor: 'oklch(0.25 0.05 285)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)'; }}
            >
              <div className="absolute inset-0 bg-[#42677D]/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10 bg-[#42677D]/10">
                <i className={`fas ${user ? 'fa-plus' : 'fa-sign-in-alt'} text-[#42677D]`}></i>
              </div>
              <h3 className="font-semibold mb-1 relative z-10" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {user ? 'Create New World' : 'Sign In'}
              </h3>
              <p className="text-sm text-center relative z-10" style={{ color: 'oklch(0.65 0.05 280)' }}>
                {user ? 'Start building your next virtual experience' : 'Sign in to create your virtual worlds'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Empty state when no worlds exist */}
      {!loading && !error && userDroplets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
            <i className="fas fa-globe text-3xl" style={{ color: 'oklch(0.50 0.05 280)' }}></i>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>No worlds yet</h3>
          <p className="mb-6" style={{ color: 'oklch(0.65 0.05 280)' }}>Create your first world to get started</p>
          {hasReachedWorldLimit ? (
            <button
              onClick={user ? handleCreateWorld : () => navigate('/signin')}
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
              }}
            >
              {user ? 'Upgrade Plan to Create More Worlds' : 'Sign in'}
            </button>
          ) : (
            <button
              onClick={user ? handleCreateWorld : () => navigate('/signin')}
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
              }}
            >
              {user ? 'Create Your First World' : 'Sign In'}
            </button>
          )}
          {hasReachedWorldLimit && (
            <p className="text-sm mt-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
              {user 
                ? 'You have reached the maximum number of worlds. Upgrade your plan to create more worlds.'
                : 'Sign in to start building your virtual worlds.'
              }
            </p>
          )}
        </div>
      )}

      {/* Domain Selection Modal */}
      <DomainSelectionModal
        open={showDomainModal}
        onClose={() => dispatch(hideDomainModal())}
      />

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={user?.plan}
      />
    </section>
  );
};

export default WorldsSection;
