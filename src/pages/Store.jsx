import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Store = () => {
  const [activeTab, setActiveTab] = useState("Featured");
  const [walletOpen, setWalletOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemCount, addItem } = useCart();
  const { connected, publicKey } = useWallet();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const { showError } = useErrorModal();
  const { showModal } = useYesNoModal();
  const { user, isAuthenticated } = useAuth();
  const { currency, toggleCurrency } = useCurrency();
  
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

  // Tab content
  let tabContent = null;
  if (activeTab === "Featured") tabContent = <FeaturedSection currency={currency} onAddToCart={handleAddToCart} />;
  else if (activeTab === "Apps") tabContent = <AppsSection currency={currency} onAddToCart={handleAddToCart} />;
  else if (activeTab === "Bundles") tabContent = <BundlesSection currency={currency} onAddToCart={handleAddToCart} />;
  else tabContent = <div className="text-center text-gray-500 py-16">Coming soon...</div>;

  return (
    <div className="text-gray-800 font-sans min-h-screen flex flex-col">
      <main className="flex-1 p-6">
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
