import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StoreHeader from "../components/store/StoreHeader";
import StoreTabs from "../components/store/StoreTabs";
import StoreCategories from "../components/store/StoreCategories";
import FeaturedSection from "../components/store/FeaturedSection";
import AppsSection from "../components/store/AppsSection";
import BundlesSection from "../components/store/BundlesSection";
import { useLoadingSpinner } from "../hooks/useLoadingSpinner";
import { useErrorModal } from "../hooks/useErrorModal";
import { useYesNoModal } from "../hooks/useYesNoModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch } from "react-redux";
import { showNotification } from "../store/uiSlice";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useCurrency } from "../hooks/useCurrency";
import { usePaymentModalContext } from "../contexts/PaymentModalContext";

const Store = () => {
  const [activeTab, setActiveTab] = useState("Featured");
  const [walletOpen, setWalletOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, addItem } = useCart();
  const { currency, toggleCurrency } = useCurrency();
  
  // Get the global payment modal function
  const { openPaymentModal } = usePaymentModalContext();
  // Get the error modal function
  const { showError } = useErrorModal();
  
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
    }).then((result) => {
      console.log('Payment successful:', result);
      
      if (result.paymentMethod === 'stripe') {
        // For Stripe, the redirect will handle the notification
        // Just close the modal
        // The PaymentModalContext handles closing and showing notifications
      } else {
        // For Solana, show notification and close modal
        dispatch(showNotification(`Payment successful! Signature: ${result.signature}`));
        // The PaymentModalContext handles closing and showing notifications
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
      // Show success notification
      dispatch(showNotification(`Payment successful! Session ID: ${sessionId}`));
      
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
