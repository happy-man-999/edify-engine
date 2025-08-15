import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { usePaymentSuccess } from "../hooks/usePaymentSuccess";
import { useErrorModal } from "../hooks/useErrorModal";
import { shortAddress } from "../utils/format";
import { showNotification } from "../store/uiSlice";

const WorldsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openPaymentModal } = usePaymentModal();
  const { handleStripePaymentSuccess, handleSolanaPaymentSuccess } = usePaymentSuccess();
  const { showError } = useErrorModal();
  
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
      alert(result.paymentMethod)
      if (result.paymentMethod === 'stripe') {
      } else if (result.paymentMethod === 'solana') {
        // For Solana, use the payment success hook for consistent handling
        try {
          await handleSolanaPaymentSuccess(result.signature);
        } catch (error) {
          console.error('Error handling Solana payment success:', error);
          showError('Payment successful, but confirmation failed');
        }
      }
    }).catch((error) => {
      console.error('Payment failed:', error);
      showError(`Payment functionality is not available for new world creation. Please try again later.`);
    });
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Worlds</h2>
        <button className="text-[#5E8EA9] hover:text-[#42677D] flex items-center transition-colors duration-300">
          <span>View All</span>
          <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empty State with Glowing Border */}
        <div onClick={handleCreateWorld} className="professional-card border-2 border-dashed border-gray-300 hover:border-[#42677D] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#42677D]/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="w-16 h-16 bg-[#42677D]/10 rounded-full flex items-center justify-center mb-4 relative z-10">
            <i className="fas fa-plus text-[#42677D]"></i>
          </div>
          <h3 className="font-semibold mb-1 relative z-10 text-gray-900">Create New World</h3>
          <p className="text-gray-500 text-sm text-center relative z-10">Start building your next virtual experience</p>
        </div>
      </div>
    </section>
  );
};

export default WorldsSection;
