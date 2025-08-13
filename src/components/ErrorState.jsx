import React from 'react';

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We're having trouble loading the content. Please try again later.",
  onRetry,
  showRetry = true,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center ${className}`}>
      {/* Error Icon */}
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
      </div>
      
      {/* Error Title */}
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        {title}
      </h3>
      
      {/* Error Message */}
      <p className="text-red-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <i className="fas fa-redo"></i>
            Try Again
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-gray-50 text-red-600 border border-red-300 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <i className="fas fa-refresh"></i>
          Refresh Page
        </button>
      </div>
      
      {/* Additional Help */}
      <div className="mt-6 text-sm text-red-500">
        <p>If the problem persists, please contact support</p>
      </div>
    </div>
  );
};

export default ErrorState; 