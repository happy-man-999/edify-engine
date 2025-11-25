import React, { useState, useEffect } from 'react';
import { usePayment } from '../hooks/usePayment';
import { useCurrency } from '../hooks/useCurrency';
import { useWalletWithRedirects } from '../hooks/useWalletWithRedirects';
import { usePaymentModal } from '../hooks/usePaymentModal';

const PaymentModal = ({ 
  open, 
  onClose, 
  amount, 
  currency = 'usd',
  itemName = 'Purchase',
  itemId = null,
  subscriptionMode = false,
  metadata = {},
  solanaOnly = false // New prop: if true, only show Solana payment option
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { processPayment, isProcessing, stripeInitialized, settingsLoading } = usePayment();
  const { connected: solanaConnected } = useWalletWithRedirects();
  const { convertUsdToSol, loading: solPriceLoading } = useCurrency();
  const { resolvePayment, rejectPayment } = usePaymentModal();

  const displayAmount = amount;

  useEffect(() => {
    if (open) {
      // If solanaOnly, default to Solana; otherwise default to Stripe
      setSelectedMethod(solanaOnly ? 'solana' : 'stripe');
    }
  }, [open, solanaOnly]);

  const handleMethodSelect = (methodId) => {
    // Prevent selecting Stripe if not initialized or settings are loading
    if (methodId === 'stripe' && (!stripeInitialized || settingsLoading)) {
      return;
    }
    setSelectedMethod(methodId);
  };

  const handleConfirmPayment = async () => {
    if (!selectedMethod) return;

    setShowConfirm(false);
    
    try {
      const result = await processPayment({
        amount: displayAmount,
        paymentMethod: selectedMethod,
        itemName,
        itemId,
        isSubscription: subscriptionMode,
        metadata
      });

      // Use the new custom event pattern
      resolvePayment(result);
    } catch (error) {
      // Use the new custom event pattern
      rejectPayment(error);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setShowConfirm(false);
      setSelectedMethod(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div 
        className="rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Header */}
        <div 
          className="p-6"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {itemId === 'custom-domain' ? 'Add a Custom Domain' : subscriptionMode ? 'Complete Subscription' : 'Complete Payment'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-white/80 hover:text-white transition-colors text-2xl disabled:opacity-50"
            >
              ×
            </button>
          </div>
          <div className="mt-2 text-white/90">
            <p className="text-sm">
              Amount: USD {displayAmount} / SOL {
                solPriceLoading ? (
                  <i className="fas fa-spinner fa-spin ml-1"></i>
                ) : (
                  convertUsdToSol(displayAmount).toFixed(3)
                )
              }
            </p>
            <p className="text-xs opacity-75">{itemName}</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Choose Payment Method</h3>
          
          <div className="space-y-3 mb-6">
            {/* Stripe Payment Method - Only show if not solanaOnly */}
            {!solanaOnly && (
              <div
                className="border-2 rounded-lg p-4 transition-all cursor-pointer"
                style={{
                  borderColor: stripeInitialized && !settingsLoading
                    ? selectedMethod === 'stripe'
                      ? 'oklch(0.45 0.15 290)'
                      : 'oklch(0.25 0.05 285)'
                    : 'oklch(0.25 0.05 285)',
                  backgroundColor: stripeInitialized && !settingsLoading && selectedMethod === 'stripe'
                    ? 'oklch(0.45 0.15 290 / 0.1)'
                    : stripeInitialized && !settingsLoading
                    ? 'transparent'
                    : 'oklch(0.12 0.02 280)',
                  opacity: stripeInitialized && !settingsLoading ? 1 : 0.6,
                  cursor: stripeInitialized && !settingsLoading ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => {
                  if (stripeInitialized && !settingsLoading) {
                    if (selectedMethod !== 'stripe') {
                      e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.8)';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (stripeInitialized && !settingsLoading) {
                    if (selectedMethod !== 'stripe') {
                      e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                    }
                  }
                }}
                onClick={() => stripeInitialized && !settingsLoading && handleMethodSelect('stripe')}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💳</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {subscriptionMode ? 'Credit Card (Subscription)' : 'Credit Card'}
                      </h4>
                      {settingsLoading ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }}>
                          <i className="fas fa-spinner fa-spin mr-1"></i>Loading
                        </span>
                      ) : stripeInitialized ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }}>
                          <i className="fas fa-check mr-1"></i>Available
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }}>
                          <i className="fas fa-spinner fa-spin mr-1"></i>Initializing
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      {subscriptionMode 
                        ? 'Subscribe with Visa, Mastercard, or other cards'
                        : 'Pay with Visa, Mastercard, or other cards'
                      }
                    </p>
                    {!stripeInitialized && !settingsLoading && (
                      <p className="text-xs mt-1" style={{ color: 'oklch(0.85 0.18 130)' }}>
                        <i className="fas fa-clock mr-1"></i>
                        Setting up payment system...
                      </p>
                    )}
                    {settingsLoading && (
                      <p className="text-xs mt-1" style={{ color: 'oklch(0.85 0.18 130)' }}>
                        <i className="fas fa-spinner fa-spin mr-1"></i>
                        Loading payment configuration...
                      </p>
                    )}
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: selectedMethod === 'stripe' ? 'oklch(0.45 0.15 290)' : 'oklch(0.25 0.05 285)',
                      backgroundColor: selectedMethod === 'stripe' ? 'oklch(0.45 0.15 290)' : 'transparent'
                    }}
                  >
                    {selectedMethod === 'stripe' && (
                      <div className="w-2 h-2 rounded-full m-0.5" style={{ backgroundColor: 'oklch(0.98 0.01 280)' }}></div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Solana Payment Method - Show when not in subscription mode OR when solanaOnly is true */}
            {(!subscriptionMode || solanaOnly) && (
              <div
                className="border-2 rounded-lg p-4 transition-all cursor-pointer"
                style={{
                  borderColor: solanaConnected && !solPriceLoading
                    ? selectedMethod === 'solana'
                      ? 'oklch(0.45 0.15 290)'
                      : 'oklch(0.25 0.05 285)'
                    : 'oklch(0.25 0.05 285)',
                  backgroundColor: solanaConnected && !solPriceLoading && selectedMethod === 'solana'
                    ? 'oklch(0.45 0.15 290 / 0.1)'
                    : solanaConnected && !solPriceLoading
                    ? 'transparent'
                    : 'oklch(0.12 0.02 280)',
                  opacity: solanaConnected && !solPriceLoading ? 1 : 0.6,
                  cursor: solanaConnected && !solPriceLoading ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => {
                  if (solanaConnected && !solPriceLoading) {
                    if (selectedMethod !== 'solana') {
                      e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.8)';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (solanaConnected && !solPriceLoading) {
                    if (selectedMethod !== 'solana') {
                      e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                    }
                  }
                }}
                onClick={() => solanaConnected && !solPriceLoading && handleMethodSelect('solana')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                      <path fill="white" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                      <path fill="white" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                      <path fill="white" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4 c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Solana (SOL)</h4>
                      {solPriceLoading ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }}>
                          <i className="fas fa-spinner fa-spin mr-1"></i>Loading Price
                        </span>
                      ) : solanaConnected ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)', color: 'oklch(0.70 0.15 150)' }}>
                          <i className="fas fa-check mr-1"></i>Available
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'oklch(0.85 0.18 130 / 0.2)', color: 'oklch(0.85 0.18 130)' }}>
                          <i className="fas fa-exclamation-triangle mr-1"></i>Wallet Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Pay with SOL cryptocurrency</p>
                    {solPriceLoading && (
                      <p className="text-xs mt-1" style={{ color: 'oklch(0.85 0.18 130)' }}>
                        <i className="fas fa-spinner fa-spin mr-1"></i>
                        Loading current SOL price...
                      </p>
                    )}
                    {!solanaConnected && !solPriceLoading && (
                      <p className="text-xs mt-1" style={{ color: 'oklch(0.85 0.18 130)' }}>
                        <i className="fas fa-wallet mr-1"></i>
                        Connect your Solana wallet to enable this payment method
                      </p>
                    )}
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: selectedMethod === 'solana' ? 'oklch(0.45 0.15 290)' : 'oklch(0.25 0.05 285)',
                      backgroundColor: selectedMethod === 'solana' ? 'oklch(0.45 0.15 290)' : 'transparent'
                    }}
                  >
                    {selectedMethod === 'solana' && (
                      <div className="w-2 h-2 rounded-full m-0.5" style={{ backgroundColor: 'oklch(0.98 0.01 280)' }}></div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
                }
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!selectedMethod || isProcessing || (selectedMethod === 'stripe' && (!stripeInitialized || settingsLoading)) || (selectedMethod === 'solana' && solPriceLoading)}
              className="flex-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'oklch(0.45 0.15 290)',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                }
              }}
            >
              {isProcessing ? 'Processing...' : 
               selectedMethod === 'stripe' && settingsLoading ? 'Loading Config...' :
               selectedMethod === 'stripe' && !stripeInitialized ? 'Initializing...' :
               selectedMethod === 'solana' && solPriceLoading ? 'Loading Price...' :
               'Continue'}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2001]">
            <div 
              className="rounded-lg p-6 max-w-sm w-full mx-4"
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>
                {subscriptionMode ? 'Confirm Subscription' : 'Confirm Payment'}
              </h3>
              <p className="mb-6" style={{ color: 'oklch(0.65 0.05 280)' }}>
                {subscriptionMode 
                  ? `You are about to subscribe for ${selectedMethod === 'stripe' ? `USD ${displayAmount}` : `SOL ${convertUsdToSol(displayAmount).toFixed(3)}`} per month. `
                  : `You are about to pay ${selectedMethod === 'stripe' ? `USD ${displayAmount}` : `SOL ${convertUsdToSol(displayAmount).toFixed(3)}`}. `
                }
                This action cannot be undone.
              </p>
              

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'oklch(0.25 0.05 285)',
                    color: 'oklch(0.98 0.01 280)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'oklch(0.45 0.15 290)',
                    color: 'oklch(0.98 0.01 280)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                    }
                  }}
                >
                  {subscriptionMode ? 'Confirm Subscription' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;