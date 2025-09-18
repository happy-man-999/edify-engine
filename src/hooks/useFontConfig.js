import { useState, useEffect, useCallback } from 'react';
import { 
  initializeFontConfig, 
  updateFontConfig, 
  getFontInfo, 
  resetFontConfig,
  detectOS,
  detectAvailableFonts 
} from '../utils/fontConfig';

/**
 * Custom hook for managing font configuration
 * Provides font detection, preservation, and cross-platform consistency
 */
export function useFontConfig() {
  const [fontConfig, setFontConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize font configuration on mount
  useEffect(() => {
    const initFonts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Wait for fonts to load
        await document.fonts.ready;
        
        // Initialize font configuration
        const config = initializeFontConfig();
        setFontConfig(config);
        
        // Set up font loading detection
        const handleFontLoad = () => {
          const updatedConfig = updateFontConfig();
          setFontConfig(updatedConfig);
        };
        
        // Listen for font loading events
        document.fonts.addEventListener('loadingdone', handleFontLoad);
        
        // Cleanup
        return () => {
          document.fonts.removeEventListener('loadingdone', handleFontLoad);
        };
      } catch (err) {
        console.error('Failed to initialize font configuration:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initFonts();
  }, []);

  // Update font configuration
  const updateFonts = useCallback(() => {
    try {
      const config = updateFontConfig();
      setFontConfig(config);
      return config;
    } catch (err) {
      console.error('Failed to update font configuration:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Reset font configuration
  const resetFonts = useCallback(() => {
    try {
      const config = resetFontConfig();
      setFontConfig(config);
      return config;
    } catch (err) {
      console.error('Failed to reset font configuration:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Get current font information
  const getCurrentFontInfo = useCallback(() => {
    try {
      return getFontInfo();
    } catch (err) {
      console.error('Failed to get font information:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Detect available fonts
  const getAvailableFonts = useCallback(() => {
    try {
      return detectAvailableFonts();
    } catch (err) {
      console.error('Failed to detect available fonts:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Get current OS
  const getCurrentOS = useCallback(() => {
    try {
      return detectOS();
    } catch (err) {
      console.error('Failed to detect OS:', err);
      setError(err.message);
      return 'unknown';
    }
  }, []);

  return {
    fontConfig,
    isLoading,
    error,
    updateFonts,
    resetFonts,
    getCurrentFontInfo,
    getAvailableFonts,
    getCurrentOS
  };
}

export default useFontConfig;
