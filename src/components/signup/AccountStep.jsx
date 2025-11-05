import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import EmailVerificationModal from '../EmailVerificationModal';

const AccountStep = ({ formData, errors, onInputChange, onNext, setErrors, goToStep }) => {
  const { 
    user, 
    isAuthenticated, 
    signupUser, 
    signupUserWithVerification,
    sendEmailVerificationCode,
    emailVerification,
    openEmailVerification,
    closeEmailVerification
  } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  
  // Check if user completed Google auth and came back to signup
  useEffect(() => {
    const googleAuthCompleted = searchParams.get('googleAuthCompleted');
    const token = searchParams.get('token');
    
    if (googleAuthCompleted === 'true' && token && isAuthenticated && user) {
      // Auto-fill the form with Google user data
      onInputChange('firstName', user.firstName || '');
      onInputChange('lastName', user.lastName || '');
      onInputChange('email', user.email || '');
      
      // Skip password fields since user is authenticated via Google
      // Skip to customization step (step 6) instead of next step
      setTimeout(() => {
        if (goToStep) {
          goToStep(6);
        } else {
          onNext();
        }
      }, 100);
    }
  }, [searchParams, isAuthenticated, user, onInputChange, onNext, goToStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setSignupError('');
    
    // Don't proceed if using Google auth (password is 'google-auth')
    if (formData.password === 'google-auth') {
      // Skip to customization step (step 6) instead of next step
      if (goToStep) {
        goToStep(6);
      } else {
        onNext();
      }
      return;
    }
    
    // Validation checks
    const validationErrors = {};
    
    if (!formData.firstName?.trim()) {
      validationErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      validationErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.passwordConfirmation) {
      validationErrors.passwordConfirmation = 'Please confirm your password';
    } else if (formData.password !== formData.passwordConfirmation) {
      validationErrors.passwordConfirmation = 'Passwords do not match';
    }
    
    // If there are validation errors, set them and don't proceed
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send verification code first
      const emailResult = await sendEmailVerificationCode(
        formData.email.trim(), 
        formData.firstName.trim()
      );
      
      if (emailResult.success) {
        // Open email verification modal
        openEmailVerification(formData.email.trim(), formData.firstName.trim());
      } else {
        setSignupError(emailResult.error || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      setSignupError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async (verificationCode) => {
    setIsLoading(true);
    setSignupError('');
    
    try {
      const result = await signupUserWithVerification({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        verificationCode: verificationCode
      });
      
      if (result.success) {
        // Skip to customization step (step 6) instead of next step
        if (goToStep) {
          goToStep(6);
        } else {
          onNext();
        }
      } else {
        setSignupError(result.error || 'Signup failed. Please try again.');
        closeEmailVerification();
      }
    } catch (error) {
      setSignupError(error.message || 'An unexpected error occurred. Please try again.');
      closeEmailVerification();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Store signup state in localStorage to resume after Google auth
    localStorage.setItem('signupInProgress', 'true');
    localStorage.setItem('signupStep', '2'); // Account step
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    
    // Redirect to Google auth with special parameter
    const currentUrl = window.location.href;
    const googleAuthUrl = '/api/auth/google?from=signup';
    
    // Store the return URL
    localStorage.setItem('signupReturnUrl', currentUrl);
    
    window.location.href = googleAuthUrl;
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join the future of immersive experiences</p>
        </div>
      
      {/* Google Sign In Button */}
      <div className="mb-8">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] transition-colors ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] transition-colors ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        {/* Only show password fields if not using Google auth */}
        {formData.password !== 'google-auth' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => onInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.passwordConfirmation}
                onChange={(e) => onInputChange('passwordConfirmation', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] transition-colors ${
                  errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.passwordConfirmation && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation}</p>}
            </div>
          </>
        )}
        
        <div className="pt-4">
          {signupError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{signupError}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg transition-colors font-medium ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#42677D] hover:bg-[#355263] text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={emailVerification.isModalOpen}
        onClose={closeEmailVerification}
        email={emailVerification.email}
        firstName={emailVerification.firstName}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
};

export default AccountStep; 