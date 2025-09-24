/**
 * Font Loading Utility
 * Ensures Inter font is properly loaded and applied across all platforms
 */

// Font loading states
const FONT_LOADING_STATES = {
  LOADING: 'fonts-loading',
  LOADED: 'fonts-loaded',
  FAILED: 'fonts-failed'
};

/**
 * Check if Inter font is available
 */
function isInterFontAvailable() {
  try {
    // Check if Inter is in the document fonts
    return document.fonts.check('16px Inter');
  } catch (error) {
    console.warn('Font check failed:', error);
    return false;
  }
}

/**
 * Wait for Inter font to load
 */
function waitForInterFont(timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    // Check if font is already loaded
    if (isInterFontAvailable()) {
      resolve(true);
      return;
    }
    
    // Listen for font loading events
    const checkFont = () => {
      if (isInterFontAvailable()) {
        resolve(true);
        return;
      }
      
      // Timeout check
      if (Date.now() - startTime > timeout) {
        console.warn('Inter font loading timeout, using fallback fonts');
        resolve(false);
        return;
      }
      
      // Continue checking
      requestAnimationFrame(checkFont);
    };
    
    // Start checking
    checkFont();
    
    // Also listen for font loading events
    const handleFontLoad = () => {
      if (isInterFontAvailable()) {
        resolve(true);
        document.fonts.removeEventListener('loadingdone', handleFontLoad);
      }
    };
    
    document.fonts.addEventListener('loadingdone', handleFontLoad);
  });
}

/**
 * Apply font loading state to document
 */
function applyFontState(state) {
  document.documentElement.className = document.documentElement.className
    .replace(/fonts-(loading|loaded|failed)/g, '')
    .trim();
  
  if (state) {
    document.documentElement.classList.add(state);
  }
}

/**
 * Initialize font loading
 */
export function initializeFontLoading() {
  // Start with loading state
  applyFontState(FONT_LOADING_STATES.LOADING);
  
  // Wait for Inter font to load
  waitForInterFont().then((loaded) => {
    if (loaded) {
      console.log('Inter font loaded successfully');
      applyFontState(FONT_LOADING_STATES.LOADED);
    } else {
      console.warn('Inter font failed to load, using fallback fonts');
      applyFontState(FONT_LOADING_STATES.FAILED);
    }
  });
}

/**
 * Force reload Inter font
 */
export function reloadInterFont() {
  // Remove existing font links
  const existingLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  existingLinks.forEach(link => link.remove());
  
  // Re-add font link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap';
  link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
  
  // Reinitialize font loading
  initializeFontLoading();
}

/**
 * Get current font loading state
 */
export function getFontLoadingState() {
  const className = document.documentElement.className;
  if (className.includes('fonts-loaded')) return FONT_LOADING_STATES.LOADED;
  if (className.includes('fonts-failed')) return FONT_LOADING_STATES.FAILED;
  return FONT_LOADING_STATES.LOADING;
}

export { FONT_LOADING_STATES };
