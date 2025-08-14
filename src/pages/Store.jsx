import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StoreHeader from "../components/store/StoreHeader";
import StoreTabs from "../components/store/StoreTabs";
import StoreCategories from "../components/store/StoreCategories";
import FeaturedSection from "../components/store/FeaturedSection";
import AppsSection from "../components/store/AppsSection";
import BundlesSection from "../components/store/BundlesSection";
import { useErrorModal } from "../hooks/useErrorModal";
import { useDispatch } from "react-redux";
import { showNotification } from "../store/uiSlice";
import { useCart } from "../hooks/useCart";
import { useCurrency } from "../hooks/useCurrency";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { usePaymentSuccess } from "../hooks/usePaymentSuccess";
import { shortAddress } from "../utils/format";

const Store = () => {
  const [activeTab, setActiveTab] = useState("Featured");
  const [walletOpen, setWalletOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, addItem } = useCart();
  const { currency, toggleCurrency } = useCurrency();
  
  // Get the global payment modal function
  const { openPaymentModal } = usePaymentModal();
  // Get the error modal function
  const { showError } = useErrorModal();
  // Get the payment success handler
  const { handleStripePaymentSuccess } = usePaymentSuccess();
  
  const handleAddToCart = (item) => {
    addItem(item, 1);
    dispatch(showNotification("Item added to cart"));
  };

  const handleCurrencyToggle = () => {
    toggleCurrency();
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  // Payment handlers
  const handleItemSelect = (item) => {
    openPaymentModal({
      amount: item.priceUSD,
      itemName: item.title,
      itemId: item._id || item.id
    }).then(async (result) => {
      console.log('Payment successful:', result);
      
      if (result.paymentMethod === 'stripe') {
        // For Stripe, the redirect will handle the notification
        // Just close the modal
        // The Redux state handles closing and showing notifications
      } else if (result.paymentMethod === 'solana') {
        // For Solana, call the payment success endpoint to get domain info
        try {
          const response = await fetch('/api/solana/payment-success', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              signature: result.signature
            })
          });

          if (response.ok) {
            const paymentResult = await response.json();
            
            // Show appropriate notification based on item type
            if (paymentResult.itemType === 'new-world' && paymentResult.domain) {
              dispatch(showNotification(`New world created successfully! Your domain: ${paymentResult.domain}`));
            } else if (paymentResult.itemType === 'item-purchase') {
              dispatch(showNotification(`Item purchased successfully! ${item.title}`));
            } else {
              dispatch(showNotification(`Payment successful! Signature: ${shortAddress(result.signature)}`));
            }
          } else {
            // Fallback to generic success message
            dispatch(showNotification(`Payment successful! Signature: ${shortAddress(result.signature)}`));
          }
        } catch (error) {
          console.error('Error getting payment details:', error);
          // Fallback to generic success message
          dispatch(showNotification(`Payment successful! Signature: ${shortAddress(result.signature)}`));
        }
        
        // The Redux state handles closing and showing notifications
      }
    }).catch((error) => {
      console.error('Payment failed:', error);
      showError(`Payment functionality is not available for ${item.title}. Please try again later.`);
    });
  };

  // Handle payment URL parameters (for Stripe redirects)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      // Call payment success endpoint
      handleStripePaymentSuccess(sessionId);
      
      // Clean up URL parameters
      navigate(location.pathname, { replace: true });
    } else if (paymentStatus === 'cancelled') {
      // Show cancellation notification
      dispatch(showNotification('Payment was cancelled'));
      
      // Clean up URL parameters
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, dispatch, navigate, location.pathname]);



  // Tab content
  let tabContent = null;
  if (activeTab === "Featured") tabContent = <FeaturedSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else if (activeTab === "Apps") tabContent = <AppsSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else if (activeTab === "Bundles") tabContent = <BundlesSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else tabContent = <div className="text-center text-gray-500 py-16">Coming soon...</div>;

  return (
    <div className="text-gray-800 font-sans min-h-screen flex flex-col">
      <main className="flex-1 p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <StoreHeader 
            onWalletClick={() => setWalletOpen(true)} 
            onCartClick={handleCartClick}
            cartCount={itemCount} 
            currency={currency} 
            onCurrencyToggle={handleCurrencyToggle} 
          />
          <StoreTabs activeTab={activeTab} onTabClick={setActiveTab} />
          <StoreCategories onCategoryClick={() => {}} />
          {tabContent}
        </div>
      </main>
    </div>
  );
};

export default Store;
