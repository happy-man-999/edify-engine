import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [signupProgress, setSignupProgress] = useState(null);
  const [hasCompletedSignup, setHasCompletedSignup] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            
            // Check signup progress
            await checkSignupProgress();
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const signup = async (userData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signin = async (credentials) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signin failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const initiateGoogleAuth = () => {
    window.location.href = '/auth/google';
  };

  const handleGoogleAuthCompletion = useCallback(async (token) => {
    try {
      setToken(token);
      localStorage.setItem('token', token);
      
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Check signup progress after Google auth
        await checkSignupProgress();
        
        return { success: true, user: data.user };
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Google auth completion error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const checkSignupProgress = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      console.log('checkSignupProgress: Token available:', !!currentToken);
      
      if (!currentToken) {
        console.log('No token available for signup progress check');
        return null;
      }

      console.log('checkSignupProgress: Making API request to:', '/api/signup-progress/progress');
      
      const response = await fetch('/api/signup-progress/progress', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('checkSignupProgress: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('checkSignupProgress: Response data:', data);
        setSignupProgress(data.progress);
        setHasCompletedSignup(data.isCompleted);
        return data;
      } else {
        console.log('checkSignupProgress: Response not ok, status:', response.status);
        const errorText = await response.text();
        console.log('checkSignupProgress: Error response:', errorText);
      }
    } catch (error) {
      console.error('Check signup progress error:', error);
    }
  };

  const saveSignupProgress = async (step, data) => {
    try {
      const currentToken = localStorage.getItem('token');
      console.log('saveSignupProgress: Token available:', !!currentToken);
      console.log('saveSignupProgress: Step:', step, 'Data:', data);
      
      if (!currentToken) {
        throw new Error('No token available for saving signup progress');
      }

      console.log('saveSignupProgress: Making API request to:', '/api/signup-progress/progress');
      
      const response = await fetch('/api/signup-progress/progress', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ step, data })
      });

      console.log('saveSignupProgress: Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('saveSignupProgress: Success response:', result);
        setSignupProgress(result.progress);
        setHasCompletedSignup(result.isCompleted);
        return result;
      } else {
        console.log('saveSignupProgress: Response not ok, status:', response.status);
        const errorText = await response.text();
        console.log('saveSignupProgress: Error response:', errorText);
        throw new Error(`Failed to save progress: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Save signup progress error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    signup,
    signin,
    signout,
    updateProfile,
    initiateGoogleAuth,
    handleGoogleAuthCompletion,
    checkSignupProgress,
    saveSignupProgress,
    signupProgress,
    hasCompletedSignup,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 