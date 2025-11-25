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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showError } = useErrorModal();
  const { isAuthenticated, user, handleGoogleAuthCompletion, saveSignupProgress, signupProgress } = useAuth();
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
    billingPeriod: 'annual', // Default to annual
  });

  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isProcessingContact, setIsProcessingContact] = useState(false);
  const googleAuthProcessedRef = useRef(false);

  // Active steps: 1 (Welcome), 2 (Account), 6 (Customization), 7 (Payment)
  // Steps 3, 4, 5 are skipped (UseCase, Persistent, Access)
  const totalSteps = 4;

  // Map internal step numbers to display step numbers
  const getDisplayStep = (internalStep) => {
    const stepMap = {
      1: 1, // Welcome
      2: 2, // Account
      6: 3, // Customization
      7: 4  // Payment
    };
    return stepMap[internalStep] || internalStep;
  };

  // Initialize Stripe on component mount
  useEffect(() => {
    initializeStripe();

      // After sign in, not yet completed signup progress.
      if (isAuthenticated) {
        // Skip onboarding for contributor users
        if (user?.isContributor) {
          navigate('/home');
          return;
        }
      
      // Step navigation is handled in the signupProgress useEffect below
      // This just ensures we don't start from step 1 if user is authenticated
    }
  }, [isAuthenticated, user, navigate]);


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
      // signupProgress.currentStep is the internal step number (2, 6, or 7)
      const currentInternalStep = signupProgress.currentStep;
      let nextStep = currentInternalStep;
      if (currentInternalStep === 2) nextStep = 6; // Account -> Customization
      else if (currentInternalStep === 6) nextStep = 7; // Customization -> Payment
      else if (currentInternalStep < 6) nextStep = 6; // If somehow on old step 3-5, go to 6
      else nextStep = 7; // Default to payment (max step)
      setCurrentStep(nextStep);
    } else if (isAuthenticated && !signupProgress) {
      // User is authenticated but has no signup progress yet
      // They've created an account, so skip to customization step
      setCurrentStep(6);
    }
  }, [signupProgress, isAuthenticated]);

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
          
          // Continue directly to customization step (skip Use Case, Persistent, and Access steps)
          setCurrentStep(6);
          
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
      // Steps 3, 4, 5 are skipped (UseCase, Persistent, Access)
      // case 3:
      //   if (formData.useCases.length === 0) {
      //     newErrors.useCases = 'Please select at least one option';
      //   }
      //   break;
      // case 4:
      //   if (!formData.isPersistent) {
      //     newErrors.isPersistent = 'Please select an option';
      //   }
      //   break;
      // case 5:
      //   if (!formData.accessMethod) {
      //     newErrors.accessMethod = 'Please select an option';
      //   }
      //   break;
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
        if (currentStep === 2 || currentStep === 6) {
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
            // Steps 3, 4, 5 are skipped (UseCase, Persistent, Access)
            // case 3:
            //   stepData = { useCases: formData.useCases };
            //   break;
            // case 4:
            //   stepData = { isPersistent: formData.isPersistent };
            //   break;
            // case 5:
            //   stepData = { accessMethod: formData.accessMethod };
            //   break;
            case 6:
              stepData = { customizationLevel: formData.customizationLevel };
              break;
          }
          
          await saveSignupProgress(currentStep, stepData);
        }
        
        // Move to next step, skipping 3, 4, 5
        setCurrentStep(prev => {
          if (prev === 1) return 2; // Welcome -> Account
          if (prev === 2) return 6; // Account -> Customization (skip 3, 4, 5)
          if (prev === 6) return 7; // Customization -> Payment
          return prev; // Already at last step
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
        // Still move to next step even if save fails
        setCurrentStep(prev => {
          if (prev === 1) return 2; // Welcome -> Account
          if (prev === 2) return 6; // Account -> Customization (skip 3, 4, 5)
          if (prev === 6) return 7; // Customization -> Payment
          return prev; // Already at last step
        });
      }
    } else {
      console.error('Validation failed, errors:', errors);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => {
      // Map internal steps back, skipping 3, 4, 5
      if (prev === 7) return 6; // Payment -> Customization
      if (prev === 6) return 2; // Customization -> Account
      if (prev === 2) return 1; // Account -> Welcome
      return 1; // Default to first step
    });
  };

  const goToStep = (step) => {
    setCurrentStep(step);
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

  const handlePayment = async (billingPeriod, price) => {
    try {
      setIsProcessingPayment(true);
      
      // Ensure Stripe is initialized
      const stripeInitialized = await initializeStripe();
      if (!stripeInitialized) {
        throw new Error('Failed to initialize Stripe');
      }

      // Update formData with billing period if provided
      if (billingPeriod) {
        setFormData(prev => ({ ...prev, billingPeriod }));
      }

      const sessionId = await createSubscriptionSession(
        null, 
        null, 
        formData.customizationLevel, 
        'Edify Engine Plan',
        { billingPeriod: billingPeriod || formData.billingPeriod, price }
      );
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

  const handleContactScheduled = async (contactData) => {
    try {
      setIsProcessingContact(true);
      
      // Save enterprise contact information and mark signup as completed
      await saveSignupProgress(7, {
        isCompleted: true,
        contactScheduled: true,
        contactData: contactData,
        completedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to save contact information:', error);
      showError('Failed to save your consultation details. Please try again.');
    } finally {
      setIsProcessingContact(false);
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
            goToStep={goToStep}
          />
        );
      // Steps 3, 4, 5 are skipped (UseCase, Persistent, Access)
      // case 3:
      //   return (
      //     <UseCaseStep
      //       formData={formData}
      //       errors={errors}
      //       onUseCaseToggle={handleUseCaseToggle}
      //       onNext={handleNext}
      //     />
      //   );
      // case 4:
      //   return (
      //     <PersistentStep
      //       formData={formData}
      //       errors={errors}
      //       onInputChange={handleInputChange}
      //       onNext={handleNext}
      //     />
      //   );
      // case 5:
      //   return (
      //     <AccessStep
      //       formData={formData}
      //       errors={errors}
      //       onInputChange={handleInputChange}
      //       onNext={handleNext}
      //     />
      //   );
      case 6:
        return (
          <CustomizationStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onNext={handleNext}
            billingPeriod={formData.billingPeriod}
            onBillingPeriodChange={(period) => handleInputChange('billingPeriod', period)}
          />
        );
      case 7:
        return (
          <PaymentStep
            formData={formData}
            isProcessingPayment={isProcessingPayment}
            isProcessingContact={isProcessingContact}
            onPayment={handlePayment}
            onContactScheduled={handleContactScheduled}
            signupProgress={signupProgress}
            billingPeriod={formData.billingPeriod}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <GlobalStyles />
      
      {/* Page-specific Schema */}
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": "https://edifyengine.com/signup",
        "name": "Edify Engine Sign Up",
        "description": "Create your free Edify Engine account and start building immersive spaces instantly."
      })}
      </script>

      {/* Progress Bar */}
      <div className="border-b" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Step {getDisplayStep(currentStep)} of {totalSteps}</span>
            <span className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>{Math.round((getDisplayStep(currentStep) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: 'oklch(0.25 0.04 285)' }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(getDisplayStep(currentStep) / totalSteps) * 100}%`,
                backgroundColor: 'oklch(0.45 0.15 290)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-xl shadow-sm p-8" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
          {renderStep()}

          {/* Navigation Buttons */}
          {currentStep > 1 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                className="px-6 py-3 border rounded-md transition-colors font-medium"
                style={{
                  borderColor: 'oklch(0.25 0.05 285)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
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