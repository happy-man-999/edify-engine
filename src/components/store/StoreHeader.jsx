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
        <div className={`flex items-center gap-2${currency === 'SOL' ? ' sol-active' : ''}`}>
          <span className={`font-bold ${currency === 'USD' ? 'text-[#42677D]' : 'text-[#0EA47A]'}`}>{currency}</span>
          <label className="relative inline-block w-[70px] h-[34px]">
            <input 
              type="checkbox" 
              checked={currency === 'SOL'} 
              onChange={onCurrencyToggle}
              className="opacity-0 w-0 h-0"
            />
            <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all duration-300 rounded-[34px] shadow-inner ${
              currency === 'USD' ? 'bg-[#42677D]' : 'bg-[#0EA47A]'
            }`}>
              <span className={`absolute h-[26px] w-[26px] left-1 bottom-1 bg-white transition-all duration-300 rounded-full flex items-center justify-center ${
                currency === 'USD' ? 'text-[#42677D]' : 'text-[#0EA47A]'
              } ${currency === 'SOL' ? 'translate-x-9' : ''}`}>
                {currency === 'USD' ? '$' : (
                  <svg className="w-3 h-3" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                    <path fill="currentColor" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                    <path fill="currentColor" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4 c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                  </svg>
                )}
              </span>
            </span>
          </label>
          <span className="hidden">SOL</span>
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
