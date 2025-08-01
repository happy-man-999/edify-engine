import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function HomepageAction() {
  const { user, signout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSignout = async () => {
    await signout();
    setMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <button onClick={() => window.location.href='https://form.typeform.com/to/KmQr2jrU'} className="bg-[#42677D] hover:bg-[#355263] text-white px-4 py-2 rounded-md transition shadow-sm">
          <i className="fas fa-plus mr-2"></i> New World
        </button>
        <div id="profileIcon" className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer connect-wallet">
          <i className="fas fa-wallet"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <button onClick={() => window.location.href='https://form.typeform.com/to/KmQr2jrU'} className="bg-[#42677D] hover:bg-[#355263] text-white px-4 py-2 rounded-md transition shadow-sm">
        <i className="fas fa-plus mr-2"></i> New World
      </button>
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <i className="fas fa-user"></i>
          )}
        </div>
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
          >
            <div className="mb-2">
              <div className="font-semibold text-gray-700">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email}
              </div>
            </div>
            <button
              className="w-full py-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={handleSignout}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}