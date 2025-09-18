import React, { useState } from 'react';
import { useFont } from './FontProvider';

/**
 * Font Debug Component
 * Shows current font configuration and allows management
 * Only visible in development mode
 */
const FontDebug = () => {
  const { fontConfig, isLoading, error, updateFonts, resetFonts, getCurrentFontInfo } = useFont();
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontInfo, setFontInfo] = useState(null);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleRefresh = () => {
    updateFonts();
    setFontInfo(getCurrentFontInfo());
  };

  const handleReset = () => {
    resetFonts();
    setFontInfo(getCurrentFontInfo());
  };

  const handleGetInfo = () => {
    setFontInfo(getCurrentFontInfo());
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
        Loading fonts...
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-sm">
      <div 
        className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Font Config</span>
        </div>
        <div className="text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-200 p-3 space-y-3">
          {error && (
            <div className="text-red-600 text-sm">
              Error: {error}
            </div>
          )}
          
          {fontConfig && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <strong>OS:</strong> {fontConfig.os}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Fonts:</strong> {fontConfig.fonts?.join(', ')}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Fallback Used:</strong> {fontConfig.fallbackUsed ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Current Font:</strong> {fontConfig.currentFont}
              </div>
            </div>
          )}
          
          {fontInfo && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <strong>Available Fonts:</strong> {fontInfo.availableFonts?.join(', ')}
              </div>
              <div className="text-xs text-gray-600">
                <strong>Current OS:</strong> {fontInfo.os}
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Refresh
            </button>
            <button
              onClick={handleGetInfo}
              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            >
              Info
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontDebug;
