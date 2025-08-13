import React, { useState } from "react";
import StoreHeader from "../components/store/StoreHeader";
import StoreTabs from "../components/store/StoreTabs";
import StoreCategories from "../components/store/StoreCategories";
import FeaturedSection from "../components/store/FeaturedSection";
import AppsSection from "../components/store/AppsSection";
import BundlesSection from "../components/store/BundlesSection";
import { sendSOLWithReference } from "../utils/paySolana";
import { useLoadingSpinner } from "../hooks/useLoadingSpinner";
import { useErrorModal } from "../hooks/useErrorModal";
import { useYesNoModal } from "../hooks/useYesNoModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch } from "react-redux";
import { showNotification } from "../store/uiSlice";
import { useAuth } from "../hooks/useAuth";
import { useCurrency } from "../hooks/useCurrency";

const Store = () => {
  const [cartCount, setCartCount] = useState(3);
  const [activeTab, setActiveTab] = useState("Featured");
  const [walletOpen, setWalletOpen] = useState(false);
  
  const dispatch = useDispatch();
  const { connected, publicKey } = useWallet();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { showError } = useErrorModal();
  const { showModal } = useYesNoModal();
  const { user, isAuthenticated } = useAuth();
  const { currency, toggleCurrency } = useCurrency();
  
  const handleAddToCart = (item) => {
    setCartCount(c => c + 1);
    dispatch(showNotification("Item added to cart"));
  };

  const handleCurrencyToggle = () => {
    toggleCurrency();
  };

  const handleCryptoPay = async (item) => {
    // Check if wallet is connected
    if (!connected || !publicKey) {
      showError("Please connect your wallet first");
      return;
    }

    if (!isAuthenticated) {
      showError("Please login to pay");
      return;
    }

    // Show confirmation modal
    const confirmed = await showModal(`Confirm payment of 0.005 SOL for ${item?.name || 'this item'}?`);

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      // Show loading spinner
      showSpinner("Processing payment...");

      // Generate a unique order ID
      const payInfo = `${user._id}-68932d2eba7b06bdb92e2978`;
      
      // Send the payment
      const signature = await sendSOLWithReference(
        import.meta.env.VITE_OWNER_SOLNANA_ADDRESS, 
        0.005, 
        payInfo
      );

      // Hide spinner and show success
      hideSpinner();
      dispatch(showNotification(`Payment successful! Transaction: ${signature.slice(0, 8)}...`));
      
      // Update cart count (remove item from cart)
      setCartCount(c => Math.max(0, c - 1));
      
    } catch (error) {
      hideSpinner();
      console.error('Payment failed:', error);
      showError(`Payment failed: ${error.message}`);
    }
  };

  // Tab content
  let tabContent = null;
  if (activeTab === "Featured") tabContent = <FeaturedSection currency={currency} onAddToCart={handleAddToCart} onCryptoPay={handleCryptoPay} />;
  else if (activeTab === "Apps") tabContent = <AppsSection currency={currency} onAddToCart={handleAddToCart} />;
  else if (activeTab === "Bundles") tabContent = <BundlesSection currency={currency} onAddToCart={handleAddToCart} />;
  else tabContent = <div className="text-center text-gray-500 py-16">Coming soon...</div>;

  return (
    <div className="text-gray-800 font-sans min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <StoreHeader onWalletClick={() => setWalletOpen(true)} cartCount={cartCount} currency={currency} onCurrencyToggle={handleCurrencyToggle} />
          <StoreTabs activeTab={activeTab} onTabClick={setActiveTab} />
          <StoreCategories onCategoryClick={() => {}} />
          {tabContent}
        </div>
      </main>
    </div>
  );
};

export default Store;
