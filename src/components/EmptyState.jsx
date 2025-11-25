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
    <div 
      className={`border rounded-xl p-8 text-center ${className}`}
      style={{
        background: 'oklch(0.18 0.05 285)',
        borderColor: 'oklch(0.25 0.05 285)'
      }}
    >
      {/* Empty State Icon */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}
      >
        <i className={`${icon} text-2xl`} style={{ color: 'oklch(0.50 0.05 280)' }}></i>
      </div>
      
      {/* Empty State Title */}
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
        {title}
      </h3>
      
      {/* Empty State Message */}
      <p className="mb-6 max-w-md mx-auto" style={{ color: 'oklch(0.65 0.05 280)' }}>
        {message}
      </p>
      
      {/* Action Button */}
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
          style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290 / 0.8)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)'; }}
        >
          <i className="fas fa-arrow-right"></i>
          {actionText}
        </button>
      )}
      
      {/* Additional Info */}
      <div className="mt-6 text-sm" style={{ color: 'oklch(0.50 0.05 280)' }}>
        <p>Check back later for new items</p>
      </div>
    </div>
  );
};

export default EmptyState; 