import React, { useState, useEffect, useCallback } from 'react';
import { useWebhook } from '../hooks/useWebhook';
import { useLoadingSpinner } from '../hooks/useLoadingSpinner';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';

const PaymentProcessingStatus = ({ userId, paymentIdentifier, paymentMethod, itemType }) => {
  const [processingStatus, setProcessingStatus] = useState('processing');
  const [domain, setDomain] = useState(null);
  const [error, setError] = useState(null);
  const [showDomain, setShowDomain] = useState(false);
  
  const dispatch = useDispatch();
  const { hideSpinner } = useLoadingSpinner();
  
  // Connect to webhook for real-time updates
  const { lastEvent: webhookEvent } = useWebhook(userId, true);
  
  // Memoize the webhook event handler to prevent infinite loops
  const handleWebhookEvent = useCallback((event) => {
    if (event.type === 'new-world-created') {
      const { domain: assignedDomain, status } = event.data;
      
      if (status === 'completed') {
        setProcessingStatus('completed');
        setDomain(assignedDomain);
        setShowDomain(true);
        hideSpinner();
        
        // Show success notification
        dispatch(showNotification(`New world created successfully! Your domain: ${assignedDomain}`));
      }
    } else if (event.type === 'new-world-creation-failed') {
      const { error: errorMessage } = event.data;
      setProcessingStatus('failed');
      setError(errorMessage);
      hideSpinner();
      
      // Show error notification
      dispatch(showNotification(`New world creation failed: ${errorMessage}`, 'error'));
    }
  }, [hideSpinner, dispatch]);
  
  // Handle webhook events
  useEffect(() => {
    if (webhookEvent) {
      handleWebhookEvent(webhookEvent);
    }
  }, [webhookEvent, handleWebhookEvent]);
  
  // Auto-hide domain info after 10 seconds
  useEffect(() => {
    if (showDomain) {
      const timer = setTimeout(() => {
        setShowDomain(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showDomain]);
  
  if (itemType !== 'new-world') {
    return null;
  }
  
  if (processingStatus === 'completed' && domain) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">New World Created!</h2>
          <p className="text-gray-600 mb-6">Your new world has been successfully created and is ready to use.</p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your assigned domain:</p>
            <p className="text-lg font-mono font-bold text-blue-600 break-all">{domain}</p>
          </div>
          
          <button
            onClick={() => setShowDomain(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }
  
  if (processingStatus === 'failed' && error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Creation Failed</h2>
          <p className="text-gray-600 mb-6">There was an error creating your new world.</p>
          
          <div className="bg-red-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600 mb-2">Error details:</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          
          <button
            onClick={() => setShowDomain(false)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  if (processingStatus === 'processing') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Creating Your New World</h2>
          <p className="text-gray-600 mb-6">Please wait while we set up your new world. This may take a few minutes.</p>
          
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              <span>Creating droplet...</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
              <span>Assigning domain...</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
              <span>Starting services...</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-6">
            You'll be notified automatically when it's ready!
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default PaymentProcessingStatus; 