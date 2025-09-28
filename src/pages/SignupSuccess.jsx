import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PaymentProcessingStatus from '../components/PaymentProcessingStatus';
import { useWebhook } from '../hooks/useWebhook';

const SignupSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSignupProgress } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [signupType, setSignupType] = useState(null);

  // Get current user ID
  const getCurrentUserId = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }, []);

  const userId = getCurrentUserId();
  
  // Connect to webhook for real-time updates
  const { lastEvent: webhookEvent } = useWebhook(userId, true);

  // Memoize the webhook event handler to prevent infinite loops
  const handleWebhookEvent = useCallback((event) => {
    if (event.type === 'new-world-created') {
      const { status } = event.data;
      
      if (status === 'completed') {
        // New world creation completed
        setCurrentPayment(null);
        setIsProcessing(false);
      }
    } else if (event.type === 'new-world-creation-failed') {
      // New world creation failed
      setCurrentPayment(null);
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {        
        // Check if this is an enterprise signup
        const type = searchParams.get('type');
        if (type === 'enterprise') {
          setSignupType('enterprise');
          setIsProcessing(false);
          return;
        }
        
        // Check if this is a payment success redirect
        const sessionId = searchParams.get('session_id');
        const paymentIntent = searchParams.get('payment_intent');
        
        if (sessionId || paymentIntent) {          
          // Call the payment-success endpoint to update payment status
          const token = localStorage.getItem('token');
          const response = await fetch('/api/stripe/payment-success', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sessionId: sessionId || paymentIntent,
              amount: 0 // Amount will be retrieved from Stripe session metadata
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            setPaymentResult(result);
            
            // Handle different payment types
            if (result.itemType === 'new-world' && result.processing) {
              // Track current payment for processing status
              setCurrentPayment({
                identifier: sessionId || paymentIntent,
                method: 'stripe',
                type: 'new-world'
              });
            } else if (result.itemType === 'basic-plan' || result.itemType === 'premium-plan') {
              // Premium basic/premium payment completed
              setIsProcessing(false);
            }
          } else {
            console.error('Failed to update payment status:', response.status);
          }
        }
        
        // Check signup completion
        const progressData = await checkSignupProgress();
        
        if (progressData && progressData.isCompleted) {
          // Check if it's enterprise signup
          if (progressData.enterpriseContact && progressData.enterpriseContact.isScheduled) {
            setSignupType('enterprise');
          } else {
            setSignupType('regular');
          }
          setIsProcessing(false);
        } else {
          //navigate('/signup');
        }
      } catch (error) {
        console.error('Error handling payment success:', error);
        //navigate('/signup');
      }
    };

    handlePaymentSuccess();
  }, [searchParams, checkSignupProgress]);

  // Handle webhook events
  useEffect(() => {
    if (webhookEvent && currentPayment) {
      handleWebhookEvent(webhookEvent);
    }
  }, [webhookEvent, currentPayment, handleWebhookEvent]);

  // Show payment processing status for new world creation
  if (currentPayment && currentPayment.type === 'new-world') {
    return (
      <PaymentProcessingStatus
        userId={userId}
        paymentIdentifier={currentPayment.identifier}
        paymentMethod={currentPayment.method}
        itemType={currentPayment.type}
      />
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h1>
              <p className="text-gray-600">Please wait while we complete your signup...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enterprise success page
  if (signupType === 'enterprise') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#223A4C] to-[#42677D] mb-6">
                <i className="fas fa-building text-white text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Enterprise Consultation Scheduled!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your interest in our Enterprise plan. Our team will be in touch soon to discuss your custom solution.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-calendar-check text-blue-600 text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Meeting Confirmed</p>
                      <p className="text-sm text-blue-700">You'll receive a calendar invite with meeting details</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-users text-blue-600 text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Expert Consultation</p>
                      <p className="text-sm text-blue-700">Meet with our enterprise team to discuss your needs</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-cogs text-blue-600 text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Custom Solution</p>
                      <p className="text-sm text-blue-700">We'll design a tailored solution for your organization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/home"
                className="block w-full bg-[#42677D] text-white py-3 px-4 rounded-lg hover:bg-[#355263] transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/store"
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Explore Store
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Check your email for meeting confirmation and additional information about our enterprise solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular success page
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Edify Engine!</h1>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. You now have access to our world engine and can start building your immersive spaces.
            </p>
            
            {/* Show domain information if new world was created */}
            {paymentResult && paymentResult.itemType === 'new-world' && paymentResult.domain && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-600 mb-2">Your new world domain:</p>
                <p className="text-lg font-mono font-bold text-blue-800 break-all">{paymentResult.domain}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Link
              to="/home"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/store"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Explore Store
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Check your email for a confirmation link and additional setup instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess; 