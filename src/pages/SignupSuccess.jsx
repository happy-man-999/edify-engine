import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SignupSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSignupProgress } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {        
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
            
            // Handle different payment types
            if (result.itemType === 'premium-plan') {
            }
          } else {
            console.error('Failed to update payment status:', response.status);
          }
        }
        
        // Check signup completion
        const progressData = await checkSignupProgress();
        
        if (progressData && progressData.isCompleted) {
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
  }, [searchParams]);

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
          </div>
          
          <div className="space-y-4">
            <Link
              to="/"
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