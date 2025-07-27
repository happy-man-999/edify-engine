import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import StoreGlobalStyles from "../components/store/StoreGlobalStyles"
import StoreHeader from "../components/store/StoreHeader";
import StoreTabs from "../components/store/StoreTabs";
import StoreCategories from "../components/store/StoreCategories";
import FeaturedSection from "../components/store/FeaturedSection";
import AppsSection from "../components/store/AppsSection";
import BundlesSection from "../components/store/BundlesSection";
import EthereumContractABI from "../utils/abis/EthereumContract.json"
import { sendSOLWithReference } from "../utils/paySolana";

const Store = () => {
  const [cartCount, setCartCount] = useState(3);
  const [currency, setCurrency] = useState("USD");
  const [activeTab, setActiveTab] = useState("Featured");
  const { writeContract, status, data, error } = useWriteContract();
  const { isConnected } = useAccount();
  const { isConnected: isPhantomConnected } = useSelector(state => state.phantom);
console.log(status, data, error)
  const handleAddToCart = (item) => {
    setCartCount(c => c + 1);
    showNotification("Item added to cart");
  };

  const handleCurrencyToggle = () => {
    setCurrency(c => c === "USD" ? "BTC" : "USD");
  };
  const handleCryptoPay = () => {
    /*sendTransaction({ 
      to: import.meta.env.VITE_OWNER_ETHEREUM_ADDRESS, 
      value: parseEther('0.00005')
    })*//*
    writeContract({
      address: import.meta.env.VITE_SMART_CONTRACT_ADDRESS,
      abi: EthereumContractABI.abi,
      functionName: 'setItemPrice',
      args: ['item', parseEther('0.00005')],
    })*/
    if (isPhantomConnected) {
      sendSOLWithReference(import.meta.env.VITE_OWNER_SOLNANA_ADDRESS, 0.005, "order-id-12345");
    }
    else if (isConnected) {
      writeContract({
        address: import.meta.env.VITE_SMART_CONTRACT_ADDRESS,
        abi: EthereumContractABI.abi,
        functionName: 'purchase',
        args: ['item'],
        value: parseEther('0.002')
      })
    }
  }

  // Tab content
  let tabContent = null;
  if (activeTab === "Featured") tabContent = <FeaturedSection currency={currency} onAddToCart={handleAddToCart} onCryptoPay={handleCryptoPay} />;
  else if (activeTab === "Apps") tabContent = <AppsSection currency={currency} onAddToCart={handleAddToCart} />;
  else if (activeTab === "Bundles") tabContent = <BundlesSection currency={currency} onAddToCart={handleAddToCart} />;
  else tabContent = <div className="text-center text-gray-400 py-16">Coming soon...</div>;

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col">
      <StoreGlobalStyles />
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
