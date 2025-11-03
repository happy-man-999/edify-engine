/**
 * API fetch wrapper that handles token expiration and authentication
 * Automatically redirects to signin page if token is expired
 */

import { isTokenExpired } from './token';
import store from '../store';
import { clearAuth } from '../store/authSlice';

/**
 * Enhanced fetch function that handles token expiration
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (same as native fetch)
 * @returns {Promise<Response>} - Fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Check if token is expired before making the request
  if (token && isTokenExpired(token)) {
    // Token is expired, clear auth and redirect
    handleTokenExpiration();
    throw new Error('Token expired');
  }
  
  // Add authorization header if token exists
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Make the fetch request
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Check if response indicates token expiration (401 Unauthorized)
  if (response.status === 401) {
    // Check if token is expired (might have expired between check and response)
    if (token && isTokenExpired(token)) {
      handleTokenExpiration();
      throw new Error('Token expired');
    }
    
    // Even if token seems valid, 401 means unauthorized
    // Clear auth state and redirect to signin
    handleTokenExpiration();
    throw new Error('Unauthorized');
  }
  
  return response;
};

/**
 * Handles token expiration by clearing auth state and redirecting to signin
 */
const handleTokenExpiration = () => {
  // Clear auth state from Redux store
  store.dispatch(clearAuth());
  
  // Clear token from localStorage
  localStorage.removeItem('token');
  
  // Redirect to signin page
  // Only redirect if not already on signin/signup pages to avoid redirect loops
  const currentPath = window.location.pathname;
  if (!currentPath.includes('/signin') && !currentPath.includes('/signup')) {
    window.location.href = '/signin';
  }
};

/**
 * Wrapper for authenticatedFetch that automatically handles JSON
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Parsed JSON response
 */
export const authenticatedFetchJSON = async (url, options = {}) => {
  const response = await authenticatedFetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};

