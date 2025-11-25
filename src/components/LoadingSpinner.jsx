import React from 'react';
import { useSelector } from 'react-redux';

export default function LoadingSpinner() {
  const { isVisible, message } = useSelector(state => state.ui.loadingSpinner);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div 
        className="rounded-full shadow-2xl w-64 h-64 flex items-center justify-center animate-modalFadeIn"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            {/* Multi-ring spinner with theme colors */}
            <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'oklch(0.45 0.15 290)' }}></div>
            <div className="absolute inset-2 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'oklch(0.50 0.18 260)', animationDelay: '0.3s' }}></div>
            <div className="absolute inset-4 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'oklch(0.45 0.15 290)', animationDelay: '0.6s' }}></div>
            <div className="absolute inset-6 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'oklch(0.50 0.18 260)', animationDelay: '0.9s' }}></div>
          </div>
          <p className="text-base font-medium animate-pulse" style={{ color: 'oklch(0.98 0.01 280)' }}>{message}</p>
        </div>
      </div>
    </div>
  );
} 