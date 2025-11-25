import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentModal } from '../hooks/usePaymentModal';
import { useAuth } from '../hooks/useAuth';
import { customizationOptions } from './signup/CustomizationStep';

const UpgradePlanModal = ({ open, onClose, currentPlan }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('annual'); // Default to annual
  const { openPaymentModal } = usePaymentModal();
  const { user } = useAuth();

  // Determine which plans to show and enable based on user status
  const isSignedIn = !!user;
  
  // Map user plan to plan hierarchy IDs
  const mapUserPlanToPlanId = (plan) => {
    if (!plan) return null;
    const planMap = {
      'basic': 'start',
      'starter': 'start',
      'premium': 'growth',
      'growth': 'growth',
      'studio': 'studio',
      'enterprise': 'enterprise'
    };
    return planMap[plan.toLowerCase()] || plan.toLowerCase();
  };
  
  // Plan hierarchy for comparison
  const planHierarchy = { 
    start: 1, 
    growth: 2, 
    studio: 3, 
    enterprise: 4, 
    basic: 1,  // Legacy support
    premium: 2, // Legacy support
    starter: 1, // Alias for start
  };
  
  const currentPlanId = mapUserPlanToPlanId(currentPlan);
  const currentLevel = planHierarchy[currentPlanId] || 0;
  
  const availablePlans = customizationOptions
    .filter(plan => !plan.isExternal)
    .map(plan => {    
      const planLevel = planHierarchy[plan.id] || 0;
      
      // Plan is selectable only if it's above the current plan level
      const isUpperPlan = planLevel > currentLevel;
      // Plan is current if it matches the current plan ID
      const isCurrentPlan = plan.id === currentPlanId || 
        (currentPlan === 'basic' && plan.id === 'start') ||
        (currentPlan === 'premium' && plan.id === 'growth') ||
        (currentPlan === 'starter' && plan.id === 'start');
      // Plan is below or same as current (should be disabled)
      const isBelowOrSamePlan = planLevel <= currentLevel && !plan.isCustom;
    
      return {
        ...plan,
        selectable: isUpperPlan && !plan.disabled,
        isCurrentPlan,
        isBelowOrSamePlan
      };
    });

  const getPrice = (plan) => {
    if (plan.isCustom) return null;
    return billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  };

  const getPriceDisplay = (plan) => {
    if (plan.isCustom) return 'Custom';
    const price = getPrice(plan);
    return billingPeriod === 'annual' ? `$${price}/year` : `$${price}/month`;
  };

  const handlePlanSelect = (plan) => {
    if (plan.selectable && !plan.disabled) {
      setSelectedPlan(plan);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    // Enterprise plan always navigates to contact page
    if (selectedPlan.id === 'enterprise' || selectedPlan.isCustom) {
      onClose();
      navigate('/contact');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Open payment modal for the selected plan
      const price = getPrice(selectedPlan);
      const result = await openPaymentModal({
        amount: price,
        itemName: `${selectedPlan.title} Plan Upgrade`,
        itemId: `${selectedPlan.id}-plan`,
        subscriptionMode: true,
        metadata: {
          billingPeriod: billingPeriod,
          price: price
        }
      });

      if (result && result.paymentMethod) {
        // Payment successful - close modal and refresh user data
        onClose();
      }
    } catch (error) {
      console.error('Plan selection failed:', error);
      // Error handling is done by the payment modal
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-modalFadeIn" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
        {/* Header */}
        <div 
          className="p-6"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isSignedIn ? 'Upgrade Your Plan' : 'Sign In'}
              </h2>
              <p className="mt-1" style={{ color: 'oklch(0.98 0.01 280 / 0.9)' }}>
                {isSignedIn 
                  ? 'Unlock more worlds and features to expand your virtual universe'
                  : 'Sign in to access your account and manage your plan'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="transition-colors text-2xl disabled:opacity-50"
              style={{ color: 'oklch(0.98 0.01 280 / 0.8)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'oklch(0.98 0.01 280 / 0.8)';
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Available Plans */}
        <div className="p-6">
          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-6">
            <div className="rounded-lg p-1 inline-flex" style={{ backgroundColor: 'oklch(0.25 0.05 285)' }}>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'shadow-sm'
                    : ''
                }`}
                style={billingPeriod === 'monthly' 
                  ? { backgroundColor: 'oklch(0.18 0.05 285)', color: 'oklch(0.50 0.18 260)' }
                  : { color: 'oklch(0.65 0.05 280)' }
                }
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
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'annual'
                    ? 'shadow-sm'
                    : ''
                }`}
                style={billingPeriod === 'annual' 
                  ? { backgroundColor: 'oklch(0.18 0.05 285)', color: 'oklch(0.50 0.18 260)' }
                  : { color: 'oklch(0.65 0.05 280)' }
                }
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
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ 
                  backgroundColor: billingPeriod === 'annual' ? 'oklch(0.60 0.15 320 / 0.2)' : 'oklch(0.50 0.18 260 / 0.2)',
                  color: billingPeriod === 'annual' ? 'oklch(0.60 0.15 320)' : 'oklch(0.50 0.18 260)'
                }}>
                  Save
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-6 mb-6 overflow-x-auto px-1">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan)}
                className={`border-2 rounded-xl p-6 transition-all duration-200 min-w-[320px] xl:min-w-0 xl:flex-1 ${
                  plan.disabled
                    ? 'cursor-not-allowed opacity-60'
                    : !plan.selectable || plan.isBelowOrSamePlan
                    ? 'cursor-not-allowed opacity-60'
                    : plan.isCurrentPlan
                    ? 'cursor-default'
                    : selectedPlan?.id === plan.id
                    ? 'shadow-md cursor-pointer'
                    : 'hover:shadow-md cursor-pointer'
                }`}
                style={
                  plan.disabled || (!plan.selectable && !plan.isCurrentPlan)
                    ? { 
                        borderColor: 'oklch(0.25 0.05 285)', 
                        backgroundColor: 'oklch(0.18 0.05 285 / 0.3)' 
                      }
                    : plan.isCurrentPlan
                    ? { 
                        borderColor: 'oklch(0.50 0.18 260)', 
                        backgroundColor: 'oklch(0.50 0.18 260 / 0.1)' 
                      }
                    : selectedPlan?.id === plan.id
                    ? { 
                        borderColor: 'oklch(0.45 0.15 290)', 
                        backgroundColor: 'oklch(0.45 0.15 290 / 0.1)' 
                      }
                    : { 
                        borderColor: 'oklch(0.25 0.05 285)', 
                        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)' 
                      }
                }
                onMouseEnter={(e) => {
                  if (!plan.disabled && plan.selectable && !plan.isCurrentPlan && selectedPlan?.id !== plan.id) {
                    e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.disabled && plan.selectable && !plan.isCurrentPlan && selectedPlan?.id !== plan.id) {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                  }
                }}
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${plan.color}1A` }}
                  >
                    <i className={`fas ${plan.icon} text-2xl`} style={{ color: plan.color }}></i>
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <h4 className="font-semibold text-lg" style={{ color: 'oklch(0.98 0.01 280)' }}>{plan.title}</h4>
                    {plan.isCurrentPlan && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'oklch(0.50 0.18 260)', color: 'oklch(0.98 0.01 280)' }}>
                        Current
                      </span>
                    )}
                    {plan.isBelowOrSamePlan && !plan.isCurrentPlan && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'oklch(0.25 0.05 285)', color: 'oklch(0.65 0.05 280)' }}>
                        Downgrade
                      </span>
                    )}
                    {plan.disabled && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'oklch(0.25 0.05 285)', color: 'oklch(0.65 0.05 280)' }}>
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>{plan.subtitle}</p>
                  
                  {!plan.disabled && (
                    <>
                      <div className="space-y-2 mb-4">
                        {plan.details.map((detail, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0" style={{ backgroundColor: 'oklch(0.70 0.15 150 / 0.2)' }}>
                              <i className="fas fa-check text-xs" style={{ color: 'oklch(0.70 0.15 150)' }}></i>
                            </div>
                            <p className="text-xs" style={{ color: 'oklch(0.98 0.01 280)' }}>{detail}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
                        <div className="text-center mb-2">
                          <span className="text-2xl font-bold" style={{ color: 'oklch(0.50 0.18 260)' }}>
                            {getPriceDisplay(plan)}
                          </span>
                          {billingPeriod === 'annual' && !plan.isCustom && (
                            <div className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                              ${(plan.priceAnnual / 12).toFixed(0)}/month billed annually
                            </div>
                          )}
                        </div>
                        {plan.worlds && (
                          <div className="text-sm font-medium text-center mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                            {typeof plan.worlds === 'number' ? `Up to ${plan.worlds} world${plan.worlds > 1 ? 's' : ''}` : plan.worlds}
                          </div>
                        )}
                        {plan.audience && (
                          <p className="text-xs text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>{plan.audience}</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  {plan.disabled && (
                    <div className="mt-4 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      Coming soon...
                    </div>
                  )}
                  
                  {selectedPlan?.id === plan.id && !plan.disabled && (
                    <div className="mt-4">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}>
                        <i className="fas fa-check text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{ 
                backgroundColor: 'oklch(0.18 0.05 285)', 
                color: 'oklch(0.98 0.01 280)',
                borderColor: 'oklch(0.25 0.05 285)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                }
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={!selectedPlan || isProcessing}
              className="flex-1 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{ 
                background: !selectedPlan || isProcessing 
                  ? 'oklch(0.25 0.05 285)' 
                  : 'linear-gradient(135deg, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (selectedPlan && !isProcessing) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, oklch(0.50 0.18 260), oklch(0.45 0.15 290))';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPlan && !isProcessing) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                }
              }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-3"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className={`fas ${isSignedIn ? 'fa-arrow-up' : 'fa-sign-in-alt'} mr-3`}></i>
                  {isSignedIn 
                    ? `Upgrade to ${selectedPlan?.title || 'Selected Plan'}`
                    : 'Sign In'
                  }
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanModal;
