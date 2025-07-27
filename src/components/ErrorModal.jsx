import React from "react";

const ErrorModal = ({ open, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[2000] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative animate-modalFadeIn">
        <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <div className="flex flex-col items-center">
          <div className="mb-4 text-red-500 text-4xl">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-xl font-bold mb-2 text-center">Error</h2>
          <p className="text-gray-700 text-center mb-4">{message}</p>
          <button className="mt-2 px-6 py-2 bg-[#42677D] text-white rounded-md font-medium hover:bg-[#355263]" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
