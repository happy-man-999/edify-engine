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
        <div className="w-16 h-16 bg-gradient-to-r from-[#42677D] to-[#5E8EA9] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <i className="fas fa-spinner fa-spin text-white text-2xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {title}
        </h3>
        <p className="text-gray-500">
          {message}
        </p>
      </div>
      
      {/* Skeleton Loading */}
      {showSkeleton && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: skeletonCount }, (_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              {/* Image skeleton */}
              <div className="h-40 bg-gray-200"></div>
              
              {/* Content skeleton */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-6"></div>
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