import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const SignupProgressCheck = ({ children }) => {
  const { isAuthenticated, hasCompletedSignup, checkSignupProgress, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      // Only check if authenticated, not loading, and haven't checked yet
      // Also skip if we're already on signup page or auth callback
      if (isAuthenticated && !loading && !hasChecked && 
          !location.pathname.includes('/signup') && 
          !location.pathname.includes('/auth-callback')) {
        setIsChecking(true);
        
        try {
          const progressData = await checkSignupProgress();
          
          if (progressData && progressData.shouldRedirectToSignup) {
            // User hasn't completed signup, redirect to signup
            navigate('/signup');
          } else if (progressData && !progressData.shouldRedirectToSignup) {
            // User has completed signup, redirect to homepage
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking signup progress:', error);
          // On error, redirect to homepage as fallback
          navigate('/');
        } finally {
          setIsChecking(false);
          setHasChecked(true);
        }
      }
    };

    checkProgress();
  }, [isAuthenticated, loading, checkSignupProgress, navigate, location.pathname, hasChecked]);

  // Show loading spinner while checking
  if (isChecking || loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, show children (normal flow)
  if (!isAuthenticated) {
    return children;
  }

  // If authenticated and not checking, show children
  return children;
};

export default SignupProgressCheck; 