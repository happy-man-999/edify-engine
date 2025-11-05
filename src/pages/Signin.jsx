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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42677D] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Checking Authentication</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
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
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#42677D] focus:ring-[#42677D]"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#42677D] hover:text-[#355263] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#42677D] hover:bg-[#355263] disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center"
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
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
            >
              <i className="fab fa-google mr-2 text-red-500"></i>
              Sign in with Google
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#42677D] hover:text-[#355263] font-medium transition-colors"
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