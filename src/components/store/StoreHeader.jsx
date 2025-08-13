import React, { useState } from "react";

const StoreHeader = ({ onWalletClick, cartCount, currency, onCurrencyToggle }) => (
  <section className="mb-12">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Edify Engine <span className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] bg-clip-text text-transparent">Store</span></h1>
        <p className="text-gray-600">Premium 3D assets, apps and world templates for your virtual experiences</p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-4">
        <div className="glass px-4 py-2 rounded-full border border-gray-200 flex items-center cursor-pointer hover:border-gray-300 transition-all duration-300" onClick={onWalletClick}>
          <i className="fas fa-coins text-yellow-500 mr-2"></i>
          <span className="font-medium text-gray-900">1,250</span>
        </div>
        <div className={`flex items-center gap-2${currency === 'BTC' ? ' btc-active' : ''}`}>
          <span className={`font-bold ${currency === 'USD' ? 'text-[#42677D]' : 'text-[#f7931a]'}`}>{currency}</span>
          <label className="relative inline-block w-[70px] h-[34px]">
            <input 
              type="checkbox" 
              checked={currency === 'BTC'} 
              onChange={onCurrencyToggle}
              className="opacity-0 w-0 h-0"
            />
            <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-[34px] shadow-inner ${
              currency === 'USD' ? 'bg-[#42677D]' : 'bg-[#f7931a]'
            }`}>
              <span className={`absolute h-[26px] w-[26px] left-1 bottom-1 bg-white transition-all duration-300 rounded-full flex items-center justify-center font-bold text-sm ${
                currency === 'USD' ? 'text-[#42677D]' : 'text-[#f7931a]'
              } ${currency === 'BTC' ? 'translate-x-9' : ''}`}>
                {currency === 'USD' ? '$' : '₿'}
              </span>
            </span>
          </label>
          <span className="hidden">BTC</span>
        </div>
        <button className="btn-primary flex items-center" onClick={onWalletClick}>
          <i className="fas fa-shopping-cart mr-2"></i>
          <span>Cart ({cartCount})</span>
        </button>
      </div>
    </div>
  </section>
);

export default StoreHeader;
