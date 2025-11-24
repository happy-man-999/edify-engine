import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { checkAuth } from '../store/authSlice';
import { isTokenValid } from '../utils/token';
import GlobalStyles from '../components/GlobalStyles';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signinUser, checkSignupProgress } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // Check if user already has a valid token on mount
  useEffect(() => {
    const checkExistingToken = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken && isTokenValid(storedToken)) {
        // Token exists and is valid, verify it with server
        try {
          const result = await dispatch(checkAuth(storedToken));
          if (result.type === 'auth/checkAuth/fulfilled' && result.payload?.user) {
            // Token is valid, check signup progress
            const user = result.payload.user;
            
            // Skip onboarding for contributor role users
            if (user.role === 'contributor') {
              navigate('/home');
              return;
            }
            
            // Check if signup process is completed
            try {
              const progressData = await checkSignupProgress();
              
              if (progressData && progressData.shouldRedirectToSignup) {
                // User hasn't completed signup, redirect to signup page
                // The signup page will load the progress and navigate to the correct step
                navigate('/signup');
              } else {
                // User has completed signup, redirect to home
                navigate('/home');
              }
            } catch (progressError) {
              console.error('Failed to check signup progress:', progressError);
              // If we can't check progress, assume signup is incomplete and redirect to signup
              navigate('/signup');
            }
            return;
          }
        } catch (error) {
          // If checkAuth fails, clear invalid token and continue with signin
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
        }
      }
      setCheckingToken(false);
    };
    
    checkExistingToken();
  }, [navigate, dispatch, checkSignupProgress]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signinUser(formData);
      
      if (result.success) {
        // Check signup progress after successful signin
        const progressData = await checkSignupProgress();
        
        // Skip onboarding for contributor role users
        if (result.user?.role === 'contributor') {
          navigate('/home');
        } else if (progressData && progressData.shouldRedirectToSignup) {
          // User hasn't completed signup, redirect to signup
          navigate('/signup');
        } else {
          // User has completed signup, redirect to homepage
          navigate('/home');
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Signin failed:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignin = () => {
    const googleAuthUrl = '/api/auth/google';
    window.location.href = googleAuthUrl;
  };

  // Show loading while checking token
  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
        <div className="rounded-xl shadow-sm p-8 max-w-md w-full mx-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: 'oklch(0.45 0.15 290)' }}
            ></div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Checking Authentication</h2>
            <p style={{ color: 'oklch(0.65 0.05 280)' }}>Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <GlobalStyles />
      
      {/* Page-specific Schema */}
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": "https://edifyengine.com/signin",
        "name": "Edify Engine Sign In",
        "description": "Log in to your Edify Engine account to manage and explore your 3D worlds."
      })}
      </script>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="rounded-xl shadow-sm p-8" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Welcome Back</h2>
            <p style={{ color: 'oklch(0.65 0.05 280)' }}>Sign in to your account to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="rounded-md p-4" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.1)', borderColor: 'oklch(0.55 0.22 25 / 0.3)' }}>
                <p className="text-sm" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.general}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: errors.email ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.email ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: errors.password ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.password ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.password}</p>}
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded"
                  style={{ borderColor: 'oklch(0.25 0.05 285)', accentColor: 'oklch(0.45 0.15 290)' }}
                />
                <span className="ml-2 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm transition-colors"
                style={{ color: 'oklch(0.45 0.15 290)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290 / 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
              >
                Forgot password?
              </Link>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3 px-6 rounded-md transition-colors font-medium flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleSignin}
              className="w-full border py-3 px-6 rounded-md transition-colors font-medium flex items-center justify-center"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
              }}
            >
              <i className="fab fa-google mr-2 text-red-500"></i>
              Sign in with Google
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
            <p className="text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium transition-colors"
                style={{ color: 'oklch(0.45 0.15 290)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290 / 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin; 