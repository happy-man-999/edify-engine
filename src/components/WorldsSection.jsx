import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { usePaymentSuccess } from "../hooks/usePaymentSuccess";
import { useErrorModal } from "../hooks/useErrorModal";
import { useUserDroplets } from "../hooks/useUserDroplets";
import { shortAddress } from "../utils/format";
import { showNotification } from "../store/uiSlice";
import WorldCard from "./WorldCard";

const WorldsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openPaymentModal } = usePaymentModal();
  const { handleStripePaymentSuccess, handleSolanaPaymentSuccess } = usePaymentSuccess();
  const { showError } = useErrorModal();
  const { userDroplets, loading, error, refreshUserDroplets } = useUserDroplets();
  
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
  
  const handleCreateWorld = () => {
    openPaymentModal({
      amount: 19.99,
      itemName: "New World",
      itemId: "new-world"
    }).then(async (result) => {
      if (!result) return;
      
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

  const handleViewAll = () => {
    navigate('/admin/droplets');
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Worlds</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshUserDroplets}
            disabled={loading}
            className="text-[#5E8EA9] hover:text-[#42677D] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            title="Refresh worlds"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          </button>
          <button 
            onClick={handleViewAll}
            className="text-[#5E8EA9] hover:text-[#42677D] flex items-center transition-colors duration-300"
          >
            <span>View All</span>
            <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="professional-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
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
            />
          ))}
          
          {/* Create New World button - only show when there are existing worlds */}
          <div onClick={handleCreateWorld} className="professional-card border-2 border-dashed border-gray-300 hover:border-[#42677D] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#42677D]/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-16 h-16 bg-[#42677D]/10 rounded-full flex items-center justify-center mb-4 relative z-10">
              <i className="fas fa-plus text-[#42677D]"></i>
            </div>
            <h3 className="font-semibold mb-1 relative z-10 text-gray-900">Create New World</h3>
            <p className="text-gray-500 text-sm text-center relative z-10">Start building your next virtual experience</p>
          </div>
        </div>
      )}
      
      {/* Empty state when no worlds exist */}
      {!loading && !error && userDroplets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-globe text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No worlds yet</h3>
          <p className="text-gray-600 mb-6">Create your first world to get started</p>
          <button
            onClick={handleCreateWorld}
            className="bg-[#42677D] text-white px-6 py-3 rounded-lg hover:bg-[#5E8EA9] transition-colors"
          >
            Create Your First World
          </button>
        </div>
      )}
    </section>
  );
};

export default WorldsSection;
