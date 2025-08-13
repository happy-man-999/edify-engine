import React from 'react';

const EmptyState = ({ 
  title = "No items found", 
  message = "There are no items available at the moment.",
  icon = "fas fa-box-open",
  showAction = false,
  actionText = "Browse All Items",
  onAction,
  className = ""
}) => {
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 text-center ${className}`}>
      {/* Empty State Icon */}
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className={`${icon} text-gray-400 text-2xl`}></i>
      </div>
      
      {/* Empty State Title */}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      
      {/* Empty State Message */}
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {/* Action Button */}
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="bg-[#42677D] hover:bg-[#355263] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
        >
          <i className="fas fa-arrow-right"></i>
          {actionText}
        </button>
      )}
      
      {/* Additional Info */}
      <div className="mt-6 text-sm text-gray-400">
        <p>Check back later for new items</p>
      </div>
    </div>
  );
};

export default EmptyState; 