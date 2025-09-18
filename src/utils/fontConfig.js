/**
 * Font Configuration Service
 * Handles font detection, preservation, and cross-platform consistency
 */

// Font configuration storage
const FONT_CONFIG_KEY = 'edifyengine_font_config';

// Default font stack with OS-specific fallbacks
const DEFAULT_FONT_STACK = {
  primary: 'Inter',
  fallbacks: {
    windows: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
    macos: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
    linux: ['Ubuntu', 'Cantarell', 'Liberation Sans', 'Arial', 'sans-serif'],
    android: ['Roboto', 'Noto Sans', 'Arial', 'sans-serif'],
    ios: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
    default: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
  }
};

/**
 * Detect the current operating system
 */
function detectOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('windows')) return 'windows';
  if (userAgent.includes('mac')) return 'macos';
  if (userAgent.includes('linux')) return 'linux';
  if (userAgent.includes('android')) return 'android';
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
  
  return 'default';
}

/**
 * Get the current computed font family from the body element
 */
function getCurrentFontFamily() {
  const body = document.body;
  if (!body) return null;
  
  const computedStyle = window.getComputedStyle(body);
  return computedStyle.fontFamily;
}

/**
 * Check if a font is available on the system
 */
function isFontAvailable(fontName) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set a baseline font
  context.font = '72px monospace';
  const baselineWidth = context.measureText('mmmmmmmmmmlli').width;
  
  // Test the font
  context.font = `72px ${fontName}, monospace`;
  const testWidth = context.measureText('mmmmmmmmmmlli').width;
  
  return baselineWidth !== testWidth;
}

/**
 * Detect available fonts from our preferred stack
 */
function detectAvailableFonts() {
  const os = detectOS();
  const fallbacks = DEFAULT_FONT_STACK.fallbacks[os] || DEFAULT_FONT_STACK.fallbacks.default;
  
  const availableFonts = [DEFAULT_FONT_STACK.primary];
  
  for (const font of fallbacks) {
    if (isFontAvailable(font)) {
      availableFonts.push(font);
    }
  }
  
  return availableFonts;
}

/**
 * Save font configuration to localStorage
 */
function saveFontConfig(config) {
  try {
    localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify({
      ...config,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    }));
    return true;
  } catch (error) {
    console.warn('Failed to save font configuration:', error);
    return false;
  }
}

/**
 * Load font configuration from localStorage
 */
function loadFontConfig() {
  try {
    const stored = localStorage.getItem(FONT_CONFIG_KEY);
    if (!stored) return null;
    
    const config = JSON.parse(stored);
    
    // Check if config is still valid (less than 30 days old)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (config.timestamp < thirtyDaysAgo) {
      localStorage.removeItem(FONT_CONFIG_KEY);
      return null;
    }
    
    return config;
  } catch (error) {
    console.warn('Failed to load font configuration:', error);
    return null;
  }
}

/**
 * Generate CSS font-family string
 */
function generateFontFamilyString(fonts) {
  return fonts.map(font => {
    // Add quotes around font names that contain spaces
    return font.includes(' ') ? `"${font}"` : font;
  }).join(', ');
}

/**
 * Apply font configuration to the document
 */
function applyFontConfig(config) {
  if (!config || !config.fonts) return false;
  
  const fontFamily = generateFontFamilyString(config.fonts);
  
  // Apply to body
  document.body.style.fontFamily = fontFamily;
  
  // Apply to root CSS variable
  document.documentElement.style.setProperty('--font-family', fontFamily);
  
  // Update any existing font classes
  const elements = document.querySelectorAll('.font-sans, [class*="font-"]');
  elements.forEach(el => {
    if (el.classList.contains('font-sans')) {
      el.style.fontFamily = fontFamily;
    }
  });
  
  return true;
}

/**
 * Initialize font configuration
 */
function initializeFontConfig() {
  // Try to load existing configuration
  let config = loadFontConfig();
  
  if (!config) {
    // Create new configuration
    const os = detectOS();
    const availableFonts = detectAvailableFonts();
    const currentFont = getCurrentFontFamily();
    
    config = {
      os,
      fonts: availableFonts,
      currentFont,
      fallbackUsed: availableFonts[0] !== DEFAULT_FONT_STACK.primary
    };
    
    // Save the new configuration
    saveFontConfig(config);
  }
  
  // Apply the configuration
  applyFontConfig(config);
  
  return config;
}

/**
 * Update font configuration when fonts change
 */
function updateFontConfig() {
  const currentFont = getCurrentFontFamily();
  const availableFonts = detectAvailableFonts();
  const os = detectOS();
  
  const config = {
    os,
    fonts: availableFonts,
    currentFont,
    fallbackUsed: availableFonts[0] !== DEFAULT_FONT_STACK.primary,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  };
  
  saveFontConfig(config);
  applyFontConfig(config);
  
  return config;
}

/**
 * Get current font information
 */
function getFontInfo() {
  const config = loadFontConfig();
  const currentFont = getCurrentFontFamily();
  const os = detectOS();
  
  return {
    config,
    currentFont,
    os,
    availableFonts: detectAvailableFonts()
  };
}

/**
 * Reset font configuration
 */
function resetFontConfig() {
  localStorage.removeItem(FONT_CONFIG_KEY);
  return initializeFontConfig();
}

// Export the API
export {
  initializeFontConfig,
  updateFontConfig,
  getFontInfo,
  resetFontConfig,
  detectOS,
  detectAvailableFonts,
  isFontAvailable,
  DEFAULT_FONT_STACK
};
