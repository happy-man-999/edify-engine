/**
 * Token utility functions for JWT token validation and expiration checking
 */

/**
 * Decodes a JWT token without verification
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param {string} token - JWT token string
 * @returns {boolean} - true if token is expired or invalid, false if valid
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Checks if a JWT token is valid (exists and not expired)
 * @param {string} token - JWT token string
 * @returns {boolean} - true if token is valid, false otherwise
 */
export const isTokenValid = (token) => {
  return !isTokenExpired(token);
};

/**
 * Gets the token expiration time
 * @param {string} token - JWT token string
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

