import React, { useState } from "react";

const StoreHeader = ({ onWalletClick, cartCount, currency, onCurrencyToggle }) => (
  <section className="mb-12">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Edify Engine <span className="gradient-text">Store</span></h1>
        <p className="text-gray-600">Premium 3D assets, apps and world templates for your virtual experiences</p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-4">
        <div className="bg-white px-4 py-2 rounded-full border border-gray-300 flex items-center cursor-pointer" onClick={onWalletClick}>
          <i className="fas fa-coins text-yellow-500 mr-2"></i>
          <span className="font-medium">1,250</span>
        </div>
        <div className={`currency-toggle-container${currency === 'BTC' ? ' btc-active' : ''}`}>
          <span className="active-currency">{currency}</span>
          <label className="currency-toggle">
            <input type="checkbox" checked={currency === 'BTC'} onChange={onCurrencyToggle} />
            <span className="currency-slider">
              <span className="usd-icon">$</span>
              <span className="btc-icon">₿</span>
            </span>
          </label>
          <span className="hidden">BTC</span>
        </div>
        <button className="bg-[#42677D] hover:bg-[#355263] text-white px-4 py-2 rounded-md transition shadow-sm flex items-center" onClick={onWalletClick}>
          <i className="fas fa-shopping-cart mr-2"></i>
          <span>Cart ({cartCount})</span>
        </button>
      </div>
    </div>
  </section>
);

export default StoreHeader;
