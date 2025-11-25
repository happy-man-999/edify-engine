import React from 'react';

const LoadingState = ({ 
  title = "Loading...",
  message = "Please wait while we fetch the latest items",
  showSkeleton = true,
  skeletonCount = 4,
  className = ""
}) => {
  return (
    <div className={`${className}`}>
      {/* Loading Header */}
      <div className="text-center mb-8">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
          }}
        >
          <i className="fas fa-spinner fa-spin text-2xl" style={{ color: 'oklch(0.98 0.01 280)' }}></i>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
          {title}
        </h3>
        <p style={{ color: 'oklch(0.65 0.05 280)' }}>
          {message}
        </p>
      </div>
      
      {/* Skeleton Loading */}
      {showSkeleton && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: skeletonCount }, (_, index) => (
            <div 
              key={index} 
              className="rounded-xl overflow-hidden shadow-sm animate-pulse"
              style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}
            >
              {/* Image skeleton */}
              <div className="h-40" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}></div>
              
              {/* Content skeleton */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}></div>
                  <div className="h-6 rounded w-16" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}></div>
                </div>
                <div className="h-3 rounded w-full mb-3" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}></div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="w-3 h-3 rounded" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}></div>
                    ))}
                  </div>
                  <div className="h-6 rounded w-6" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingState; 