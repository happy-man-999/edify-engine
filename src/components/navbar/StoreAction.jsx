import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useCart } from '../../hooks/useCart';

export default function StoreAction() {
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative hidden md:block">
        <input 
          type="text" 
          placeholder="Search store..." 
          className="pl-10 pr-4 py-2 border text-white placeholder-gray-400 rounded-md w-64"
          style={{
            borderColor: 'oklch(0.25 0.05 285 / 0.5)',
            backgroundColor: 'oklch(0.18 0.05 285 / 0.5)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'oklch(0.50 0.18 260)';
            e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.50 0.18 260 / 0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
      <button id="cartButton" className="relative" onClick={handleCartClick}>
        <i 
          className="fas fa-shopping-cart text-xl text-gray-300 transition-colors"
          onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.85 0.18 130)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209, 213, 219)'}
        ></i>
        {itemCount > 0 && (
          <span 
            className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}
          >
            {itemCount}
          </span>
        )}
      </button>
      <UserMenu />
    </div>
  );
}