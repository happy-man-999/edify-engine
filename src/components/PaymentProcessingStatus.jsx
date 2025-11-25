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
        <div 
          className="rounded-lg p-8 max-w-md mx-4 text-center"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285)',
            borderColor: 'oklch(0.25 0.05 285)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="text-6xl mb-4" style={{ color: 'oklch(0.70 0.15 150)' }}>✅</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>New World Created!</h2>
          <p className="mb-6" style={{ color: 'oklch(0.65 0.05 280)' }}>Your new world has been successfully created and is ready to use.</p>
          
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
            <p className="text-sm mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Your assigned domain:</p>
            <p className="text-lg font-mono font-bold break-all" style={{ color: 'oklch(0.45 0.15 290)' }}>{domain}</p>
          </div>
          
          <button
            onClick={() => setShowDomain(false)}
            className="px-6 py-2 rounded-lg transition-colors"
            style={{
              background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
            }}
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
        <div 
          className="rounded-lg p-8 max-w-md mx-4 text-center"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285)',
            borderColor: 'oklch(0.25 0.05 285)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="text-6xl mb-4" style={{ color: 'oklch(0.55 0.22 25)' }}>❌</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Creation Failed</h2>
          <p className="mb-6" style={{ color: 'oklch(0.65 0.05 280)' }}>There was an error creating your new world.</p>
          
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'oklch(0.55 0.22 25 / 0.1)', borderColor: 'oklch(0.55 0.22 25 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
            <p className="text-sm mb-2" style={{ color: 'oklch(0.55 0.22 25)' }}>Error details:</p>
            <p className="text-sm" style={{ color: 'oklch(0.55 0.22 25)' }}>{error}</p>
          </div>
          
          <button
            onClick={() => setShowDomain(false)}
            className="px-6 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'oklch(0.55 0.22 25)',
              color: 'oklch(0.98 0.01 280)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.60 0.22 25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'oklch(0.55 0.22 25)';
            }}
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
        <div 
          className="rounded-lg p-8 max-w-md mx-4 text-center"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285)',
            borderColor: 'oklch(0.25 0.05 285)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Creating Your New World</h2>
          <p className="mb-6" style={{ color: 'oklch(0.65 0.05 280)' }}>Please wait while we set up your new world. This may take a few minutes.</p>
          
          <div className="space-y-3 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}></div>
              <span>Creating droplet...</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'oklch(0.50 0.05 280)' }}></div>
              <span>Assigning domain...</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'oklch(0.50 0.05 280)' }}></div>
              <span>Starting services...</span>
            </div>
          </div>
          
          <p className="text-xs mt-6" style={{ color: 'oklch(0.50 0.05 280)' }}>
            You'll be notified automatically when it's ready!
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default PaymentProcessingStatus; 