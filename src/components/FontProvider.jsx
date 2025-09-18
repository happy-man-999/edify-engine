import React, { createContext, useContext, useEffect } from 'react';
import useFontConfig from '../hooks/useFontConfig';

// Create font context
const FontContext = createContext();

// Font provider component
export const FontProvider = ({ children }) => {
  const fontConfig = useFontConfig();

  // Apply font configuration when it changes
  useEffect(() => {
    if (fontConfig.fontConfig) {
      const { fonts, os, fallbackUsed } = fontConfig.fontConfig;
      
      // Log font information for debugging
      console.log('Font Configuration Applied:', {
        os,
        fonts,
        fallbackUsed,
        currentFont: document.body.style.fontFamily || getComputedStyle(document.body).fontFamily
      });
      
      // Update CSS custom property
      if (fonts && fonts.length > 0) {
        const fontFamily = fonts.map(font => 
          font.includes(' ') ? `"${font}"` : font
        ).join(', ');
        
        document.documentElement.style.setProperty('--font-family', fontFamily);
      }
    }
  }, [fontConfig.fontConfig]);

  // Show font loading indicator if needed
  useEffect(() => {
    if (fontConfig.isLoading) {
      // Add a subtle loading indicator
      const indicator = document.createElement('div');
      indicator.id = 'font-loading-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(66, 103, 125, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      indicator.textContent = 'Loading fonts...';
      document.body.appendChild(indicator);
      
      // Fade in
      setTimeout(() => {
        indicator.style.opacity = '1';
      }, 100);
      
      return () => {
        // Fade out and remove
        indicator.style.opacity = '0';
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 300);
      };
    }
  }, [fontConfig.isLoading]);

  return (
    <FontContext.Provider value={fontConfig}>
      {children}
    </FontContext.Provider>
  );
};

// Hook to use font context
export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

export default FontProvider;
