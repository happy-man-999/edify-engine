import React from 'react';
import UserMenu from './UserMenu';

export default function StoreAction() {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative hidden md:block">
        <input type="text" placeholder="Search store..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-[#42677D] focus:ring-[#42677D] w-64" />
        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
      <button id="cartButton" className="relative">
        <i className="fas fa-shopping-cart text-xl text-gray-600 hover:text-[#42677D]"></i>
        <span className="absolute -top-2 -right-2 bg-[#42677D] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
      </button>
      <UserMenu />
    </div>
  );
}