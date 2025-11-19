import React, { useState, useEffect } from 'react';
import { customizationOptions } from './CustomizationStep';
import EnterpriseContactStep from './EnterpriseContactStep';

const PaymentStep = ({ formData, onPayment, onContactScheduled, isProcessingPayment, isProcessingContact, signupProgress, billingPeriod: propBillingPeriod = 'annual' }) => {
  const [paymentSettings, setPaymentSettings] = useState({
    stripeMode: 'live',
    solanaMode: 'mainnet',
    isTestMode: false
  });
  const [billingPeriod, setBillingPeriod] = useState(propBillingPeriod);
  
  // Sync with prop changes
  useEffect(() => {
    setBillingPeriod(propBillingPeriod);
  }, [propBillingPeriod]);

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const response = await fetch('/api/admin/payment-settings');
        if (response.ok) {
          const { settings } = await response.json();
          setPaymentSettings(settings);
        }
      } catch (error) {
        console.warn('Failed to fetch payment settings:', error);
      }
    };

    fetchPaymentSettings();
  }, []);

  const isTestMode = paymentSettings.isTestMode || paymentSettings.stripeMode === 'test' || paymentSettings.solanaMode === 'devnet';
  const availablePlans = customizationOptions.filter(option => !option.isExternal);
  const plan =
    availablePlans.find(option => `${option.id}-plan` === formData.customizationLevel) ||
    availablePlans[0];
  const isEnterprisePlan = formData.customizationLevel === 'enterprise-plan';

  const getPrice = () => {
    if (plan.isCustom) return null;
    return billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  };

  const getPriceDisplay = () => {
    if (plan.isCustom) return 'Custom';
    const price = getPrice();
    return billingPeriod === 'annual' ? `$${price}/year` : `$${price}/month`;
  };

  // If enterprise plan, show contact step instead of payment
  if (isEnterprisePlan) {
    return (
      <EnterpriseContactStep
        formData={formData}
        onContactScheduled={onContactScheduled}
        isProcessingContact={isProcessingContact}
        signupProgress={signupProgress}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{plan.title}</h2>
        <p className="text-gray-600">{plan.subtitle}</p>
      </div>

      {/* Billing Period Toggle */}
      {!plan.isCustom && (
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-[#42677D] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-white text-[#42677D] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save
              </span>
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 mb-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#42677D] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className={`fas ${plan.icon} text-white text-2xl`}></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.title} Plan</h3>
        </div>
        
        <div className="space-y-4 mb-6">
          {plan.details.map((detail, index) => (
            <div key={index} className="flex items-start">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <i className="fas fa-check text-green-600 text-xs"></i>
              </div>
              <p className="text-gray-700">
                {detail}
              </p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-blue-200 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-[#42677D]">{getPriceDisplay()}</span>
          </div>
          {billingPeriod === 'annual' && !plan.isCustom && (
            <div className="text-sm text-gray-500 text-center mb-2">
              ${(plan.priceAnnual / 12).toFixed(0)}/month billed annually
            </div>
          )}
          <p className="text-sm text-gray-500 text-center">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>

      {/* Secure Payment Section */}
      <div className="text-center space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-shield-alt text-green-600 text-xl"></i>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-green-800">Secure Payment</h4>
              <p className="text-sm text-green-700">Your payment information is protected by Stripe</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-green-700">
            <div className="flex items-center">
              <i className="fas fa-lock mr-1"></i>
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-1"></i>
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-user-shield mr-1"></i>
              <span>No card storage</span>
            </div>
          </div>
        </div>

        {isTestMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-yellow-600 mt-0.5 mr-2"></i>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Test Mode</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This is a test payment. Use test card numbers like 4242 4242 4242 4242. 
                  No real money will be charged.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => onPayment(billingPeriod, getPrice())}
          disabled={isProcessingPayment}
          className={`w-full py-4 px-8 rounded-lg transition-all duration-200 font-medium text-lg ${
            isProcessingPayment
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#42677D] hover:bg-[#355263] hover:shadow-lg'
          } text-white`}
        >
          {isProcessingPayment ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-3"></div>
              Redirecting to Secure Payment...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <i className="fas fa-credit-card mr-3"></i>
              Continue to Secure Payment
            </div>
          )}
        </button>
        
        {isProcessingPayment && (
          <p className="text-sm text-gray-500 mt-3">
            You'll be redirected to Stripe's secure payment page
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentStep; 