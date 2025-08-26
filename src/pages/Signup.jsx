import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { initializeStripe, createSubscriptionSession, redirectToCheckout } from '../utils/stripe';
import {
  WelcomeStep,
  AccountStep,
  UseCaseStep,
  PersistentStep,
  AccessStep,
  CustomizationStep,
  PaymentStep
} from '../components/signup';
import GlobalStyles from '../components/GlobalStyles';
import { useErrorModal } from '../hooks/useErrorModal';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const { showError } = useErrorModal();
  const { isAuthenticated, handleGoogleAuthCompletion, saveSignupProgress, signupProgress } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    useCases: [],
    isPersistent: '',
    accessMethod: '',
    customizationLevel: '',
  });

  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const googleAuthProcessedRef = useRef(false);

  const totalSteps = 7;

  // Initialize Stripe on component mount
  useEffect(() => {
    initializeStripe();

    // After sign in, not yet completed signup progress.
    if (isAuthenticated) {
      if (!signupProgress) {
        setCurrentStep(3);
      }
      else {
        const nextStep = Math.min(signupProgress.currentStep + 1, totalSteps);
        setCurrentStep(nextStep);
      }
    }
  }, []);


  // Load existing signup progress
  useEffect(() => {
    if (signupProgress && isAuthenticated) {
      // Load saved progress into form data
      if (signupProgress.accountInfo) {
        setFormData(prev => ({
          ...prev,
          firstName: signupProgress.accountInfo.firstName || '',
          lastName: signupProgress.accountInfo.lastName || '',
          email: signupProgress.accountInfo.email || '',
          password: signupProgress.accountInfo.isGoogleAuth ? 'google-auth' : '',
          passwordConfirmation: signupProgress.accountInfo.isGoogleAuth ? 'google-auth' : ''
        }));
      }
      
      if (signupProgress.useCases) {
        setFormData(prev => ({
          ...prev,
          useCases: signupProgress.useCases
        }));
      }
      
      if (signupProgress.isPersistent) {
        setFormData(prev => ({
          ...prev,
          isPersistent: signupProgress.isPersistent
        }));
      }
      
      if (signupProgress.accessMethod) {
        setFormData(prev => ({
          ...prev,
          accessMethod: signupProgress.accessMethod
        }));
      }
      
      if (signupProgress.customizationLevel) {
        setFormData(prev => ({
          ...prev,
          customizationLevel: signupProgress.customizationLevel
        }));
      }
      
      // Set current step to the next incomplete step
      const nextStep = Math.min(signupProgress.currentStep + 1, totalSteps);
      setCurrentStep(nextStep);
    }
  }, []);

  // Handle Google auth completion
  useEffect(() => {
    const googleAuthCompleted = searchParams.get('googleAuthCompleted');
    const token = searchParams.get('token');
    
    if (googleAuthCompleted === 'true' && token && !googleAuthProcessedRef.current) {
      googleAuthProcessedRef.current = true;
      
      const handleGoogleAuth = async () => {
        const result = await handleGoogleAuthCompletion(token);
        
        if (result.success) {
          const googleUser = result.user;
          
          // Auto-fill form with Google user data
          setFormData(prev => ({
            ...prev,
            firstName: googleUser.firstName || '',
            lastName: googleUser.lastName || '',
            email: googleUser.email || '',
            password: 'google-auth', // Placeholder for Google auth
            passwordConfirmation: 'google-auth'
          }));
          
          // Continue to next step (Use Case step)
          setCurrentStep(3);
          
          // Clean up URL parameters
          window.history.replaceState({}, document.title, '/signup');
          
          // Save the account info to progress
          try {
            await saveSignupProgress(2, {
              firstName: googleUser.firstName || '',
              lastName: googleUser.lastName || '',
              email: googleUser.email || '',
              isGoogleAuth: true
            });
          } catch (error) {
            console.error('Failed to save Google auth progress:', error);
          }
        } else {
          console.error('Google auth completion failed:', result.error);
        }
      };
      
      handleGoogleAuth();
    }
  }, [searchParams, handleGoogleAuthCompletion]);

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 2:
        break;
      case 3:
        if (formData.useCases.length === 0) {
          newErrors.useCases = 'Please select at least one option';
        }
        break;
      case 4:
        if (!formData.isPersistent) {
          newErrors.isPersistent = 'Please select an option';
        }
        break;
      case 5:
        if (!formData.accessMethod) {
          newErrors.accessMethod = 'Please select an option';
        }
        break;
      case 6:
        if (!formData.customizationLevel) {
          newErrors.customizationLevel = 'Please select an option';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      try {
        // Save progress for current step
        if (currentStep >= 2 && currentStep <= 6) {
          let stepData = {};
          
          switch (currentStep) {
            case 2:
              stepData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                isGoogleAuth: formData.password === 'google-auth'
              };
              break;
            case 3:
              stepData = { useCases: formData.useCases };
              break;
            case 4:
              stepData = { isPersistent: formData.isPersistent };
              break;
            case 5:
              stepData = { accessMethod: formData.accessMethod };
              break;
            case 6:
              stepData = { customizationLevel: formData.customizationLevel };
              break;
          }
          
          await saveSignupProgress(currentStep, stepData);
        }
        
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      } catch (error) {
        console.error('Failed to save progress:', error);
        // Still move to next step even if save fails
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      }
    } else {
      console.error('Validation failed, errors:', errors);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUseCaseToggle = (useCase) => {
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter(uc => uc !== useCase)
        : [...prev.useCases, useCase]
    }));
    if (errors.useCases) {
      setErrors(prev => ({ ...prev, useCases: '' }));
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Ensure Stripe is initialized
      const stripeInitialized = await initializeStripe();
      if (!stripeInitialized) {
        throw new Error('Failed to initialize Stripe');
      }

      const sessionId = await createSubscriptionSession(null, null, 'basic-plan', 'Edify Engine Basic Plan');
      await redirectToCheckout(sessionId);
      
      // Note: User will be redirected to Stripe, then back to success page
      // The success page will be reached via the success_url in the checkout session
    } catch (error) {
      console.error('Payment failed:', error);
      // You could show an error modal here
      showError('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return (
          <AccountStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNext={handleNext}
            setErrors={setErrors}
          />
        );
      case 3:
        return (
          <UseCaseStep
            formData={formData}
            errors={errors}
            onUseCaseToggle={handleUseCaseToggle}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <PersistentStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <AccessStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        );
      case 6:
        return (
          <CustomizationStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        );
      case 7:
        return (
          <PaymentStep
            isProcessingPayment={isProcessingPayment}
            onPayment={handlePayment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <GlobalStyles />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#42677D] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          {currentStep > 1 && currentStep < totalSteps && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup; 