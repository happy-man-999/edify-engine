import React from "react";

const ErrorModal = ({ open, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[2000] flex items-center justify-center">
      <div 
        className="rounded-xl shadow-xl max-w-md w-full p-8 relative animate-modalFadeIn"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        <button 
          className="absolute top-4 right-4 text-2xl transition-colors" 
          style={{ color: 'oklch(0.65 0.05 280)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.98 0.01 280)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="mb-4 text-4xl" style={{ color: 'oklch(0.55 0.22 25)' }}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-xl font-bold mb-2 text-center" style={{ color: 'oklch(0.98 0.01 280)' }}>Error</h2>
          <p className="text-center mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>{message}</p>
          <button 
            className="mt-2 px-6 py-2 rounded-md font-medium transition-colors"
            style={{
              backgroundColor: 'oklch(0.45 0.15 290)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
