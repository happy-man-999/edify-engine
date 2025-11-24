import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component that handles automatic redirects based on authentication state
 * Should be placed inside Router but outside Routes
 */
const AuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useSelector(state => state.auth);

  useEffect(() => {
    const isAuthPage = location.pathname === '/signin' || 
                       location.pathname === '/signup' || 
                       location.pathname === '/auth-callback' ||
                       location.pathname === '/signup-success' ||
                       location.pathname === '/discounted-plan' ||
                       location.pathname === '/pricing' ||
                       location.pathname === '/features' ||
                       location.pathname === '/resources' ||
                       location.pathname === '/about' ||
                       location.pathname === '/';
    
    // If user is not authenticated, no token, and not on an auth page, redirect to signin
    if (!isAuthenticated && !token && !isAuthPage) {
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, token, location.pathname, navigate]);

  return null;
};

export default AuthRedirect;

