import React from 'react';
import { useSelector } from 'react-redux';

export default function LoadingSpinner() {
  const { isVisible, message } = useSelector(state => state.ui.loadingSpinner);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-full shadow-2xl w-64 h-64 flex items-center justify-center animate-modalFadeIn">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            {/* Multi-ring spinner with theme colors */}
            <div className="absolute inset-0 border-4 border-transparent border-t-[#42677D] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-[#5E8EA9] rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-[#42677D] rounded-full animate-spin" style={{ animationDelay: '0.6s' }}></div>
            <div className="absolute inset-6 border-4 border-transparent border-t-[#5E8EA9] rounded-full animate-spin" style={{ animationDelay: '0.9s' }}></div>
          </div>
          <p className="text-gray-700 text-base font-medium animate-pulse">{message}</p>
        </div>
      </div>
    </div>
  );
} 