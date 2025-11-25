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
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>{plan.title}</h2>
        <p style={{ color: 'oklch(0.65 0.05 280)' }}>{plan.subtitle}</p>
      </div>

      {/* Billing Period Toggle */}
      {!plan.isCustom && (
        <div className="flex justify-center mb-6">
          <div className="rounded-lg p-1 inline-flex" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="px-6 py-2 rounded-md font-medium transition-all"
              style={billingPeriod === 'monthly' ? {
                backgroundColor: 'oklch(0.45 0.15 290)',
                color: 'oklch(0.98 0.01 280)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              } : {
                color: 'oklch(0.65 0.05 280)'
              }}
              onMouseEnter={(e) => {
                if (billingPeriod !== 'monthly') {
                  e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                }
              }}
              onMouseLeave={(e) => {
                if (billingPeriod !== 'monthly') {
                  e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                }
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className="px-6 py-2 rounded-md font-medium transition-all"
              style={billingPeriod === 'annual' ? {
                backgroundColor: 'oklch(0.45 0.15 290)',
                color: 'oklch(0.98 0.01 280)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              } : {
                color: 'oklch(0.65 0.05 280)'
              }}
              onMouseEnter={(e) => {
                if (billingPeriod !== 'annual') {
                  e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                }
              }}
              onMouseLeave={(e) => {
                if (billingPeriod !== 'annual') {
                  e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                }
              }}
            >
              Annual
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={billingPeriod === 'annual' ? {
                backgroundColor: 'oklch(0.60 0.15 320 / 0.3)',
                color: 'oklch(0.60 0.15 320)'
              } : {
                backgroundColor: 'oklch(0.50 0.18 260 / 0.2)',
                color: 'oklch(0.50 0.18 260)'
              }}>
                Save
              </span>
            </button>
          </div>
        </div>
      )}
      
      <div className="p-8 rounded-2xl mb-8" style={{ 
        background: 'linear-gradient(to bottom right, oklch(0.18 0.05 285), oklch(0.18 0.05 285))',
        borderColor: 'oklch(0.25 0.05 285)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}>
            <i className={`fas ${plan.icon} text-2xl`} style={{ color: 'oklch(0.98 0.01 280)' }}></i>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>{plan.title} Plan</h3>
        </div>
        
        <div className="space-y-4 mb-6">
          {plan.details.map((detail, index) => (
            <div key={index} className="flex items-start">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}>
                <i className="fas fa-check text-xs" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
              </div>
              <p style={{ color: 'oklch(0.98 0.01 280)' }}>
                {detail}
              </p>
            </div>
          ))}
        </div>
        
        <div className="pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Total Amount:</span>
            <span className="text-2xl font-bold" style={{ color: 'oklch(0.45 0.15 290)' }}>{getPriceDisplay()}</span>
          </div>
          {billingPeriod === 'annual' && !plan.isCustom && (
            <div className="text-sm text-center mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>
              ${(plan.priceAnnual / 12).toFixed(0)}/month billed annually
            </div>
          )}
          <p className="text-sm text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
            Secure payment powered by Stripe
          </p>
        </div>
      </div>

      {/* Secure Payment Section */}
      <div className="text-center space-y-6">
        <div className="rounded-lg p-6" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.1)', borderColor: 'oklch(0.50 0.18 260 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}>
              <i className="fas fa-shield-alt text-xl" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold" style={{ color: 'oklch(0.50 0.18 260)' }}>Secure Payment</h4>
              <p className="text-sm" style={{ color: 'oklch(0.50 0.18 260)' }}>Your payment information is protected by Stripe</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm" style={{ color: 'oklch(0.50 0.18 260)' }}>
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
          <div className="rounded-lg p-4" style={{ backgroundColor: 'oklch(0.60 0.15 320 / 0.1)', borderColor: 'oklch(0.60 0.15 320 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
            <div className="flex items-start">
              <i className="fas fa-info-circle mt-0.5 mr-2" style={{ color: 'oklch(0.60 0.15 320)' }}></i>
              <div>
                <h4 className="text-sm font-medium" style={{ color: 'oklch(0.60 0.15 320)' }}>Test Mode</h4>
                <p className="text-sm mt-1" style={{ color: 'oklch(0.60 0.15 320)' }}>
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
          className="w-full py-4 px-8 rounded-lg transition-all duration-200 font-medium text-lg"
          style={isProcessingPayment ? {
            backgroundColor: 'oklch(0.25 0.05 285)',
            color: 'oklch(0.65 0.05 280)',
            cursor: 'not-allowed'
          } : {
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
          onMouseEnter={(e) => {
            if (!isProcessingPayment) {
              e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessingPayment) {
              e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {isProcessingPayment ? (
            <div className="flex items-center justify-center">
              <div className="mr-3" style={{ width: '20px', height: '20px', border: '3px solid oklch(0.45 0.15 290 / 0.3)', borderTopColor: 'oklch(0.45 0.15 290)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
          <p className="text-sm mt-3" style={{ color: 'oklch(0.65 0.05 280)' }}>
            You'll be redirected to Stripe's secure payment page
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentStep; 