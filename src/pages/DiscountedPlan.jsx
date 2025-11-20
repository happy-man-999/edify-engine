import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { useErrorModal } from '../hooks/useErrorModal';
import { useLoadingSpinner } from '../hooks/useLoadingSpinner';
import EmailVerificationModal from '../components/EmailVerificationModal';
import GlobalStyles from '../components/GlobalStyles';
import Navbar from '../components/navbar';
import { showNotification } from '../store/uiSlice';
import { initializeStripe, createSubscriptionSession, redirectToCheckout } from '../utils/stripe';

const DiscountedPlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    sendEmailVerificationCode, 
    signupUserWithVerification,
    emailVerification,
    openEmailVerification,
    closeEmailVerification
  } = useAuth();
  const { showError } = useErrorModal();
  const { showSpinner, hideSpinner } = useLoadingSpinner();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Check if user is already authenticated (has token)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsEmailVerified(true);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
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
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleVerifyEmail = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSignupError('');

    try {
      const emailResult = await sendEmailVerificationCode(
        formData.email.trim(), 
        formData.firstName.trim()
      );
      
      if (emailResult.success) {
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
        closeEmailVerification();
        // Mark email as verified so Subscribe Now button is enabled
        setIsEmailVerified(true);
        setSignupError('');
        
        // Verify that user is signed up (token should be set)
        const token = localStorage.getItem('token');
        if (token) {
          // Show success notification
          dispatch(showNotification('Account created successfully! You can now subscribe to the plan.'));
        } else {
          // If token is not set, show error
          setSignupError('Account created but session not established. Please try again.');
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

  const handleSubscribe = async () => {
    if (!isEmailVerified) {
      showError('Please verify your email first before subscribing. Click "Verify Email" to get started.');
      return;
    }

    // Check if user is already signed up
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Please verify your email first before subscribing.');
      return;
    }

    try {
      setIsProcessingPayment(true);
      showSpinner('Processing subscription...');

      // Ensure Stripe is initialized
      const stripeInitialized = await initializeStripe();
      if (!stripeInitialized) {
        throw new Error('Failed to initialize Stripe');
      }

      // Create subscription session with discounted price ID flag
      const successUrl = `${window.location.origin}/signup-success?session_id={CHECKOUT_SESSION_ID}&type=discounted-plan`;
      const cancelUrl = `${window.location.origin}/discounted-plan`;
      
      const sessionId = await createSubscriptionSession(
        successUrl,
        cancelUrl,
        'start-plan', // itemId
        'Starter Annual Plan (Discounted)', // itemName
        { 
          billingPeriod: 'annual', 
          price: 189,
          discounted: true // Flag to use discounted price ID
        }
      );

      // Redirect to Stripe checkout
      await redirectToCheckout(sessionId);
      
      // Note: User will be redirected to Stripe, then back to success page
      // The success page will be reached via the success_url in the checkout session
    } catch (error) {
      console.error('Payment failed:', error);
      showError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
      hideSpinner();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalStyles />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8 mt-12">
          <div className="inline-block bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg mb-4">
            <span className="font-semibold">25% Off Starter Annual Plan</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Special Discounted Offer
          </h1>
          <p className="text-xl text-gray-600">
            Get started with our Starter Annual Plan at a special discounted price
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Plan Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Details</h2>
            
            <div className="mb-6">
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-bold text-[#42677D]">$189</span>
                <span className="text-xl text-gray-600 ml-2">/year</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                <span className="line-through text-gray-400">$252/year</span>
                <span className="ml-2 text-green-600 font-semibold">Save $63 (25% off)</span>
              </div>
              <p className="text-gray-600">
                Regular yearly: $252
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">What's Included:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">1 World included</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">Full access to world engine</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">Dedicated hosting</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">Annual billing (save 25%)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="At least 8 characters"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.passwordConfirmation}
                  onChange={(e) => handleInputChange('passwordConfirmation', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42677D] ${
                    errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
                {errors.passwordConfirmation && (
                  <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation}</p>
                )}
              </div>

              {signupError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{signupError}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Verify Email'}
                </button>
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={isLoading || !isEmailVerified}
                  className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${
                    isLoading || !isEmailVerified
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-[#42677D] hover:bg-[#355263] text-white'
                  }`}
                  title={!isEmailVerified ? 'Please verify your email first' : ''}
                >
                  Subscribe Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={emailVerification.isModalOpen}
        onClose={closeEmailVerification}
        email={emailVerification.email}
        firstName={emailVerification.firstName}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default DiscountedPlan;

