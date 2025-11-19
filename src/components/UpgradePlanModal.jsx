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
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isSignedIn ? 'Upgrade Your Plan' : 'Sign In'}
              </h2>
              <p className="text-white/90 mt-1">
                {isSignedIn 
                  ? 'Unlock more worlds and features to expand your virtual universe'
                  : 'Sign in to access your account and manage your plan'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-white/80 hover:text-white transition-colors text-2xl disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* Available Plans */}
        <div className="p-6">
          {/* Billing Period Toggle */}
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
          
          <div className="flex flex-col xl:flex-row gap-6 mb-6 overflow-x-auto px-1">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan)}
                className={`border-2 rounded-xl p-6 transition-all duration-200 min-w-[320px] xl:min-w-0 xl:flex-1 ${
                  plan.disabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : !plan.selectable || plan.isBelowOrSamePlan
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    : plan.isCurrentPlan
                    ? 'border-[#5E8EA9] bg-[#5E8EA9]/5 cursor-default'
                    : selectedPlan?.id === plan.id
                    ? 'border-[#42677D] shadow-md bg-[#42677D]/5 cursor-pointer'
                    : 'border-gray-200 hover:border-[#42677D] hover:shadow-md cursor-pointer'
                }`}
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${plan.color}1A` }}
                  >
                    <i className={`fas ${plan.icon} text-2xl`} style={{ color: plan.color }}></i>
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">{plan.title}</h4>
                    {plan.isCurrentPlan && (
                      <span className="ml-2 px-2 py-1 bg-[#5E8EA9] text-white text-xs rounded-full">
                        Current
                      </span>
                    )}
                    {plan.isBelowOrSamePlan && !plan.isCurrentPlan && (
                      <span className="ml-2 px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
                        Downgrade
                      </span>
                    )}
                    {plan.disabled && (
                      <span className="ml-2 px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{plan.subtitle}</p>
                  
                  {!plan.disabled && (
                    <>
                      <div className="space-y-2 mb-4">
                        {plan.details.map((detail, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              <i className="fas fa-check text-green-600 text-xs"></i>
                            </div>
                            <p className="text-xs text-gray-700">{detail}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-center mb-2">
                          <span className="text-2xl font-bold text-[#42677D]">
                            {getPriceDisplay(plan)}
                          </span>
                          {billingPeriod === 'annual' && !plan.isCustom && (
                            <div className="text-xs text-gray-500 mt-1">
                              ${(plan.priceAnnual / 12).toFixed(0)}/month billed annually
                            </div>
                          )}
                        </div>
                        {plan.worlds && (
                          <div className="text-sm font-medium text-gray-700 text-center mb-2">
                            {typeof plan.worlds === 'number' ? `Up to ${plan.worlds} world${plan.worlds > 1 ? 's' : ''}` : plan.worlds}
                          </div>
                        )}
                        {plan.audience && (
                          <p className="text-xs text-gray-500 text-center">{plan.audience}</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  {plan.disabled && (
                    <div className="mt-4 text-sm text-gray-400">
                      Coming soon...
                    </div>
                  )}
                  
                  {selectedPlan?.id === plan.id && !plan.disabled && (
                    <div className="mt-4">
                      <div className="w-6 h-6 bg-[#42677D] rounded-full flex items-center justify-center mx-auto">
                        <i className="fas fa-check text-white text-sm"></i>
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
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={!selectedPlan || isProcessing}
              className="flex-1 px-4 py-3 bg-[#42677D] text-white rounded-lg hover:bg-[#355263] transition-colors disabled:opacity-50"
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
