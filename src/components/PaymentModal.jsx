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
  metadata = {}
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { processPayment, isProcessing, stripeInitialized, settingsLoading } = usePayment();
  const { connected: solanaConnected } = useWalletWithRedirects();
  const { convertUsdToSol } = useCurrency();
  const { resolvePayment, rejectPayment } = usePaymentModal();

  const displayAmount = amount;

  useEffect(() => {
    if (open) {
      setSelectedMethod('stripe'); // Default to Stripe
    }
  }, [open]);

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {subscriptionMode ? 'Complete Subscription' : 'Complete Payment'}
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
            <p className="text-sm">Amount: USD {displayAmount} / SOL {convertUsdToSol(displayAmount).toFixed(2)}</p>
            <p className="text-xs opacity-75">{itemName}</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Payment Method</h3>
          
          <div className="space-y-3 mb-6">
            {/* Stripe Payment Method */}
            <div
              className={`border-2 rounded-lg p-4 transition-all ${
                stripeInitialized && !settingsLoading
                  ? selectedMethod === 'stripe'
                    ? 'border-[#42677D] bg-[#42677D]/5 cursor-pointer'
                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
              onClick={() => stripeInitialized && !settingsLoading && handleMethodSelect('stripe')}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💳</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-800">
                      {subscriptionMode ? 'Credit Card (Subscription)' : 'Credit Card'}
                    </h4>
                    {settingsLoading ? (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        <i className="fas fa-spinner fa-spin mr-1"></i>Loading
                      </span>
                    ) : stripeInitialized ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <i className="fas fa-check mr-1"></i>Available
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        <i className="fas fa-spinner fa-spin mr-1"></i>Initializing
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {subscriptionMode 
                      ? 'Subscribe with Visa, Mastercard, or other cards'
                      : 'Pay with Visa, Mastercard, or other cards'
                    }
                  </p>
                  {!stripeInitialized && !settingsLoading && (
                    <p className="text-xs text-yellow-600 mt-1">
                      <i className="fas fa-clock mr-1"></i>
                      Setting up payment system...
                    </p>
                  )}
                  {settingsLoading && (
                    <p className="text-xs text-yellow-600 mt-1">
                      <i className="fas fa-spinner fa-spin mr-1"></i>
                      Loading payment configuration...
                    </p>
                  )}
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod === 'stripe'
                    ? 'border-[#42677D] bg-[#42677D]'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'stripe' && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Solana Payment Method - Only show when not in subscription mode */}
            {!subscriptionMode && (
              <div
                className={`border-2 rounded-lg p-4 transition-all ${
                  solanaConnected
                    ? selectedMethod === 'solana'
                      ? 'border-[#42677D] bg-[#42677D]/5 cursor-pointer'
                      : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
                onClick={() => solanaConnected && handleMethodSelect('solana')}
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
                      <h4 className="font-medium text-gray-800">Solana (SOL)</h4>
                      {solanaConnected ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          <i className="fas fa-check mr-1"></i>Available
                        </span>
                      ) : (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          <i className="fas fa-exclamation-triangle mr-1"></i>Wallet Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Pay with SOL cryptocurrency</p>
                    {!solanaConnected && (
                      <p className="text-xs text-orange-600 mt-1">
                        <i className="fas fa-wallet mr-1"></i>
                        Connect your Solana wallet to enable this payment method
                      </p>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === 'solana'
                      ? 'border-[#42677D] bg-[#42677D]'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'solana' && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
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
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!selectedMethod || isProcessing || (selectedMethod === 'stripe' && (!stripeInitialized || settingsLoading))}
              className="flex-1 px-4 py-3 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 
               selectedMethod === 'stripe' && settingsLoading ? 'Loading Config...' :
               selectedMethod === 'stripe' && !stripeInitialized ? 'Initializing...' :
               'Continue'}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2001]">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {subscriptionMode ? 'Confirm Subscription' : 'Confirm Payment'}
              </h3>
              <p className="text-gray-600 mb-6">
                {subscriptionMode 
                  ? `You are about to subscribe for ${selectedMethod === 'stripe' ? `USD ${displayAmount}` : `SOL ${convertUsdToSol(displayAmount).toFixed(2)}`} per month. `
                  : `You are about to pay ${selectedMethod === 'stripe' ? `USD ${displayAmount}` : `SOL ${convertUsdToSol(displayAmount).toFixed(2)}`}. `
                }
                This action cannot be undone.
              </p>
              

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors disabled:opacity-50"
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