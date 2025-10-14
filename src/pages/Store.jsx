import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StoreHeader from "../components/store/StoreHeader";
import StoreTabs from "../components/store/StoreTabs";
import StoreCategories from "../components/store/StoreCategories";
import FeaturedSection from "../components/store/FeaturedSection";
import AppsSection from "../components/store/AppsSection";
import BundlesSection from "../components/store/BundlesSection";
import ThreeDObjectsSection from "../components/store/ThreeDObjectsSection";
import WorldTemplatesSection from "../components/store/WorldTemplatesSection";
import MyPurchasesSection from "../components/store/MyPurchasesSection";
import { useErrorModal } from "../hooks/useErrorModal";
import { useDispatch } from "react-redux";
import { showNotification } from "../store/uiSlice";
import { useCart } from "../hooks/useCart";
import { useCurrency } from "../hooks/useCurrency";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { usePaymentSuccess } from "../hooks/usePaymentSuccess";
import { useWalletWithRedirects } from "../hooks/useWalletWithRedirects";
import { useSolBalance } from "../hooks/useSolBalance";
import { shortAddress } from "../utils/format";
import PaymentProcessingStatus from "../components/PaymentProcessingStatus";
import { useCallback } from "react";

const Store = () => {
  const [activeTab, setActiveTab] = useState("3D Objects");
  const [walletOpen, setWalletOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, addItem } = useCart();
  const { currency, toggleCurrency } = useCurrency();
  const { connected } = useWalletWithRedirects();
  const { balance: solBalance, firstLoading: balanceLoading } = useSolBalance();
  
  // Get the global payment modal function
  const { openPaymentModal } = usePaymentModal();
  // Get the error modal function
  const { showError } = useErrorModal();
  // Get the payment success handler
  const { handleStripePaymentSuccess, handleSolanaPaymentSuccess, isPaymentProcessing } = usePaymentSuccess();
  
  // Get current user ID
  const getCurrentUserId = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }, []);

  const userId = getCurrentUserId();

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
      if (!result || !result.paymentMethod) return;
      
      if (result.paymentMethod === 'stripe') {
        // For Stripe, the redirect will handle the notification
        // Just close the modal
        // The Redux state handles closing and showing notifications
      } else if (result.paymentMethod === 'solana') {
        // For Solana, use the payment success hook for consistent handling
        try {
          const paymentResult = await handleSolanaPaymentSuccess(result.signature);
          
          // Track current payment for processing status
          if (paymentResult.itemType === 'new-world' && paymentResult.processing) {
            setCurrentPayment({
              identifier: result.signature,
              method: 'solana',
              type: 'new-world'
            });
          }
          
          // Show appropriate notification based on item type
          if (paymentResult.itemType === 'new-world' && paymentResult.domain) {
            dispatch(showNotification(`New world created successfully! Your domain: ${paymentResult.domain}`));
          } else if (paymentResult.itemType === 'item-purchase') {
            dispatch(showNotification(`Item purchased successfully! ${item.title}`));
            // Redirect to My Purchases tab after successful item purchase
            setActiveTab("My Purchases");
          } else if (paymentResult.itemType === 'cart-purchase') {
            dispatch(showNotification(`Cart purchased successfully!`));
            // Redirect to My Purchases tab after successful cart purchase
            setActiveTab("My Purchases");
          } else {
            dispatch(showNotification(`Payment successful! Signature: ${shortAddress(result.signature)}`));
          }
        } catch (error) {
          console.error('Error getting payment details:', error);
          // Fallback to generic success message
          showError('Payment successful, but confirmation failed');
        }
        
        // The Redux state handles closing and showing notifications
      }
    }).catch((error) => {
      console.error('Payment failed:', error);
      showError(error.message);
    });
  };

  // Handle payment URL parameters (for Stripe redirects)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      handleStripePaymentSuccess(sessionId).then((result) => {
        // Redirect to My Purchases tab after successful Stripe payment
        if (result && (result.itemType === 'item-purchase' || result.itemType === 'cart-purchase')) {
          setActiveTab("My Purchases");
        }
      });
      navigate(location.pathname, { replace: true });
    } else if (paymentStatus === 'cancelled') {
      dispatch(showNotification('Payment was cancelled'));
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, dispatch, navigate, location.pathname]);

  // Handle tab parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    // Valid tab names
    const validTabs = ["Featured", "Apps", "Bundles", "World Templates", "3D Objects", "My Purchases"];
    
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
      // Clean up URL by removing the tab parameter after a short delay
      // This allows the user to see the URL change and bookmark if needed
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 100);
    }
  }, [location.search, navigate, location.pathname]);

  // Handle item ID parameter from URL (for direct purchase links)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const itemId = searchParams.get('id');
    
    if (itemId) {
      // Fetch the item by ID and trigger purchase modal
      const fetchAndOpenItem = async () => {
        try {
          const response = await fetch(`/api/items/${itemId}`);
          if (!response.ok) {
            throw new Error('Item not found');
          }
          const item = await response.json();
          
          // Trigger the payment modal for this item
          handleItemSelect(item);
          
          // Clean up URL by removing the id parameter
          navigate(location.pathname, { replace: true });
        } catch (error) {
          console.error('Error fetching item:', error);
          showError('Item not found or unavailable');
          navigate(location.pathname, { replace: true });
        }
      };
      
      fetchAndOpenItem();
    }
  }, [location.search, navigate, location.pathname, showError]);

  // Tab content
  let tabContent = null;
  if (activeTab === "Featured") tabContent = <FeaturedSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else if (activeTab === "Apps") tabContent = <AppsSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else if (activeTab === "Bundles") tabContent = <BundlesSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else if (activeTab === "World Templates") tabContent = <WorldTemplatesSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else if (activeTab === "3D Objects") tabContent = <ThreeDObjectsSection currency={currency} onAddToCart={handleAddToCart} onItemSelect={handleItemSelect} />;
  else if (activeTab === "My Purchases") tabContent = <MyPurchasesSection onItemSelect={handleItemSelect} onBrowseStore={() => handleTabClick("Featured")} />;
  else tabContent = <div className="text-center text-gray-500 py-16">Coming soon...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Page-specific Schema */}
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": "https://edifyengine.com/store/",
        "name": "Edify Engine Store",
        "description": "Shop 3D assets, premium apps, and immersive world tools in the Edify Engine Store."
      })}
      </script>
      
      {/* Payment Processing Status */}
      {currentPayment && (
        <PaymentProcessingStatus
          userId={userId}
          paymentIdentifier={currentPayment.identifier}
          paymentMethod={currentPayment.method}
          itemType={currentPayment.type}
        />
      )}
      
      <main className="flex-1 p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <StoreHeader 
            onWalletClick={() => setWalletOpen(true)} 
            onCartClick={handleCartClick}
            cartCount={itemCount} 
            currency={currency} 
            onCurrencyToggle={handleCurrencyToggle}
            walletConnected={connected}
            solBalance={solBalance}
            balanceLoading={balanceLoading}
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
