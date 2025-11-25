import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Sparkles, Zap, Rocket, Crown, Play } from 'lucide-react';
import Badge from '../components/landing/Badge';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingFooter from '../components/landing/LandingFooter';
import GlobalStyles from '../components/GlobalStyles';
import { useAuth } from '../hooks/useAuth';
import { usePaymentModal } from '../hooks/usePaymentModal';
import { usePaymentSuccess } from '../hooks/usePaymentSuccess';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/uiSlice';
import { useErrorModal } from '../hooks/useErrorModal';
import { shortAddress } from '../utils/format';

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { openPaymentModal } = usePaymentModal();
  const { handleStripePaymentSuccess, handleSolanaPaymentSuccess } = usePaymentSuccess();
  const { showError } = useErrorModal();
  const [billingPeriod, setBillingPeriod] = useState('annual'); // Default to annual
  const [isProcessing, setIsProcessing] = useState(false);

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

  const currentPlan = user?.plan;
  const currentPlanId = mapUserPlanToPlanId(currentPlan);
  const currentLevel = planHierarchy[currentPlanId] || 0;

  // Handle payment success from URL parameters (for Stripe redirects)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      handleStripePaymentSuccess(sessionId).then((result) => {
        if (result && (result.itemType === 'start-plan' || result.itemType === 'growth-plan' || result.itemType === 'studio-plan' || result.itemType === 'enterprise-plan' || result.itemType === 'basic-plan' || result.itemType === 'premium-plan')) {
          const planName = result.planName || (result.itemType === 'start-plan' || result.itemType === 'basic-plan' ? 'Start' :
                                               result.itemType === 'growth-plan' || result.itemType === 'premium-plan' ? 'Growth' :
                                               result.itemType === 'studio-plan' ? 'Studio' :
                                               result.itemType === 'enterprise-plan' ? 'Enterprise' : 'selected plan');
          dispatch(showNotification(`Plan upgraded to ${planName} successfully!`));
          // Reload to refresh user data
          window.location.reload();
        }
      });
      navigate(location.pathname, { replace: true });
    } else if (paymentStatus === 'cancelled') {
      dispatch(showNotification('Payment was cancelled'));
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, dispatch, navigate, location.pathname, handleStripePaymentSuccess]);

  const basePlans = [
    {
      name: 'Start',
      id: 'start',
      icon: Sparkles,
      priceMonthly: 29,
      priceAnnual: 252,
      description: 'Start Your First World',
      features: [
        'Unlimited access to our world engine',
        '1 world',
        'Dedicated Server and Hosting',
        'No coding necessary - drag and drop interface',
      ],
      popular: false,
    },
    {
      name: 'Growth',
      id: 'growth',
      icon: Zap,
      priceMonthly: 59,
      priceAnnual: 528,
      description: 'Expand Your Universe',
      features: [
        'Unlimited access to our world engine',
        'Up to 3 worlds',
        'Dedicated Server and Hosting',
        'No coding necessary - drag and drop interface',
      ],
      popular: true,
    },
    {
      name: 'Studio',
      id: 'studio',
      icon: Rocket,
      priceMonthly: 149,
      priceAnnual: 1344,
      description: 'Scale Your Projects',
      features: [
        'Unlimited access to our world engine',
        'Up to 10 worlds',
        'Dedicated Server and Hosting',
        'No coding necessary - drag and drop interface',
      ],
      popular: false,
    },
    {
      name: 'Enterprise',
      id: 'enterprise',
      icon: Crown,
      priceMonthly: null,
      priceAnnual: null,
      priceCustom: 'Custom',
      description: 'Unlimited Scale',
      features: [
        'Unlimited access to our world engine',
        'Unlimited worlds',
        'Dedicated provisioning',
        'Priority support',
        'Custom solutions',
      ],
    },
  ];

  // Enrich plans with current plan status
  const plans = basePlans.map(plan => {
    const planLevel = planHierarchy[plan.id] || 0;
    const isCurrentPlan = plan.id === currentPlanId || 
      (currentPlan === 'basic' && plan.id === 'start') ||
      (currentPlan === 'premium' && plan.id === 'growth') ||
      (currentPlan === 'starter' && plan.id === 'start');
    const isUpgrade = planLevel > currentLevel;
    const isDowngrade = planLevel < currentLevel && !plan.priceCustom;
    
    let cta = 'Subscribe';
    if (plan.priceCustom) {
      cta = 'Contact Sales';
    } else if (user && isCurrentPlan) {
      cta = 'Current Plan';
    } else if (user && isUpgrade) {
      cta = 'Upgrade';
    } else if (user && isDowngrade) {
      cta = 'Downgrade';
    }

    return {
      ...plan,
      isCurrentPlan,
      isUpgrade,
      isDowngrade,
      cta,
      selectable: !isCurrentPlan || isUpgrade || isDowngrade
    };
  });

  const getPrice = (plan) => {
    if (plan.priceCustom) return plan.priceCustom;
    return billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  };

  const getPriceDisplay = (plan) => {
    if (plan.priceCustom) return plan.priceCustom;
    const price = getPrice(plan);
    return billingPeriod === 'annual' ? `$${price}/year` : `$${price}/month`;
  };

  const faqs = [
    {
      question: 'Can I upgrade or downgrade at any time?',
      answer: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your current billing period.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Edify Engine fees are non-refundable. All payments are final, including monthly and annual plans, world provisioning costs, store purchase and charges related to AI generation or hosting.\nDeleting a world does not entitle you to a refund.\nCanceling your plan will stop future billing, but it does not issue a refund for previous charges.\nIf your subscription includes a free trial or promotional period, you must cancel before the renewal date to avoid being billed.',
    },
    {
      question: 'Can I pay annually?',
      answer: 'Yes! Annual plans receive a discount. You can select annual billing on any plan during signup. Enterprise plans have custom pricing - contact sales for details.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'Edify Engine accepts both traditional and Web3 payment methods. Credit & Debit Cards (via Stripe) including Digital Wallets such as Apple Pay, Google Pay, Link by Stripe and Crypto / Web3 Payments in Solana (SOL)',
    },
  ];

  const handlePlanClick = async (plan) => {
    if (plan.priceCustom || plan.cta === 'Contact Sales') {
      navigate('/contact');
      return;
    }

    // If user is not signed in, go to signup
    if (!user) {
      navigate('/signup', { state: { selectedPlan: plan.id } });
      return;
    }

    // If it's the current plan, do nothing
    if (plan.isCurrentPlan) {
      return;
    }

    // Handle upgrade/downgrade for signed-in users
    setIsProcessing(true);
    try {
      // Handle downgrades differently - no payment required
      if (plan.isDowngrade) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/stripe/downgrade-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              itemId: `${plan.id}-plan`,
              billingPeriod: billingPeriod
            })
          });

          if (response.ok) {
            const result = await response.json();
            dispatch(showNotification(`Plan downgraded to ${plan.name} successfully! ${result.message || ''}`));
            // Reload to refresh user data
            window.location.reload();
          } else {
            const error = await response.json();
            if (error.limitExceeded) {
              showError(`Cannot downgrade: ${error.error}`);
            } else {
              showError(error.error || 'Failed to downgrade subscription');
            }
          }
        } catch (error) {
          console.error('Error downgrading subscription:', error);
          showError('Failed to downgrade subscription. Please try again.');
        } finally {
          setIsProcessing(false);
        }
        return;
      }

      // Handle upgrades - payment required
      const price = billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
      
      // Open payment modal for the selected plan
      const result = await openPaymentModal({
        amount: price,
        itemName: `${plan.name} Plan Upgrade`,
        itemId: `${plan.id}-plan`,
        subscriptionMode: true,
        metadata: {
          billingPeriod: billingPeriod,
          price: price
        }
      });

      if (!result || !result.paymentMethod) {
        setIsProcessing(false);
        return;
      }

      // Handle payment success based on payment method
      if (result.paymentMethod === 'stripe') {
        // For Stripe, the redirect will handle the notification via useEffect
        // Just close the modal - the redirect will handle confirmation
      } else if (result.paymentMethod === 'solana') {
        // For Solana, use the payment success hook for consistent handling
        try {
          const paymentResult = await handleSolanaPaymentSuccess(result.signature, result.metadata);
          
          // Show appropriate notification based on plan upgrade
          if (paymentResult.itemType === 'start-plan' || paymentResult.itemType === 'growth-plan' || paymentResult.itemType === 'studio-plan' || paymentResult.itemType === 'enterprise-plan' || paymentResult.itemType === 'basic-plan' || paymentResult.itemType === 'premium-plan') {
            const planName = paymentResult.planName || plan.name;
            dispatch(showNotification(`Plan upgraded to ${planName} successfully!`));
            // Reload to refresh user data
            window.location.reload();
          } else {
            dispatch(showNotification(`Payment successful! Signature: ${shortAddress(result.signature)}`));
          }
        } catch (error) {
          console.error('Error getting payment details:', error);
          // Fallback to generic success message
          showError('Payment successful, but confirmation failed');
        }
      }
    } catch (error) {
      console.error('Plan change failed:', error);
      showError('Payment failed', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <GlobalStyles />
      <LandingNavbar />
      <div className="relative pt-24 pb-16">
        <section className="px-4 py-24 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge 
                className="mb-6 px-4 py-2 text-sm border"
                style={{
                  backgroundColor: 'oklch(0.85 0.18 130 / 0.2)',
                  color: 'oklch(0.85 0.18 130)',
                  borderColor: 'oklch(0.85 0.18 130 / 0.5)'
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simple, Transparent Pricing
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                Choose Your Plan
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Start free and scale as you grow. All plans include core features with no hidden fees.
              </p>
            </motion.div>

            {/* Billing Period Toggle */}
            <div className="flex justify-center mb-12">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={plan.popular ? 'lg:scale-105' : ''}
                >
                  <div 
                    className="h-full p-6 rounded-xl backdrop-blur border relative"
                    style={{
                      backgroundColor: plan.isCurrentPlan ? 'oklch(0.50 0.18 260 / 0.1)' : 'oklch(0.18 0.05 285 / 0.5)',
                      borderColor: plan.isCurrentPlan 
                        ? 'oklch(0.50 0.18 260)' 
                        : plan.popular 
                        ? 'oklch(0.85 0.18 130)' 
                        : 'oklch(0.25 0.05 285 / 0.5)',
                      boxShadow: plan.isCurrentPlan 
                        ? '0 0 20px oklch(0.50 0.18 260 / 0.3)' 
                        : plan.popular 
                        ? '0 10px 15px -3px oklch(0.85 0.18 130 / 0.2)' 
                        : 'none'
                    }}
                  >
                    {plan.popular && !plan.isCurrentPlan && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge 
                          className="px-4 py-1"
                          style={{
                            backgroundColor: 'oklch(0.85 0.18 130)',
                            color: 'oklch(0.12 0.02 280)'
                          }}
                        >
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    {plan.isCurrentPlan && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge 
                          className="px-4 py-1"
                          style={{
                            backgroundColor: 'oklch(0.50 0.18 260)',
                            color: 'oklch(0.98 0.01 280)'
                          }}
                        >
                          Current Plan
                        </Badge>
                      </div>
                    )}
                    {plan.isDowngrade && !plan.isCurrentPlan && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge 
                          className="px-4 py-1"
                          style={{
                            backgroundColor: 'oklch(0.25 0.05 285)',
                            color: 'oklch(0.65 0.05 280)'
                          }}
                        >
                          Downgrade
                        </Badge>
                      </div>
                    )}
                    <div className="mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{
                          background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
                        }}
                      >
                        <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold gradient-text">{getPriceDisplay(plan)}</span>
                        {plan.priceCustom && <span className="text-gray-400 block text-sm mt-1">Contact for pricing</span>}
                        {!plan.priceCustom && billingPeriod === 'annual' && (
                          <div className="text-sm text-gray-400 mt-1">
                            ${(getPrice(plan) / 12).toFixed(0)}/month billed annually
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <ul className="space-y-3 mb-6 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.85 0.18 130)' }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handlePlanClick(plan)}
                        disabled={plan.isCurrentPlan || isProcessing}
                        className="w-full py-3 rounded-md font-semibold transition-all glow-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        style={
                          plan.isCurrentPlan
                            ? {
                                background: 'oklch(0.25 0.05 285)',
                                color: 'oklch(0.65 0.05 280)',
                                borderColor: 'oklch(0.25 0.05 285)',
                                borderWidth: '1px',
                                borderStyle: 'solid'
                              }
                            : plan.popular
                            ? {
                                background: 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.85 0.18 130 / 0.8))',
                                color: 'oklch(0.12 0.02 280)',
                                boxShadow: '0 0 30px oklch(0.85 0.18 130 / 0.4)'
                              }
                            : {
                                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                                color: 'white'
                              }
                        }
                        onMouseEnter={(e) => {
                          if (plan.isCurrentPlan || isProcessing) return;
                          if (plan.popular) {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130 / 0.9), oklch(0.85 0.18 130 / 0.7))';
                          } else {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (plan.isCurrentPlan || isProcessing) return;
                          if (plan.popular) {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.85 0.18 130), oklch(0.85 0.18 130 / 0.8))';
                          } else {
                            e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                          }
                        }}
                      >
                        {isProcessing && plan.selectable ? 'Processing...' : plan.cta}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div 
                      className="p-6 rounded-xl backdrop-blur border"
                      style={{
                        backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
                        borderColor: 'oklch(0.25 0.05 285 / 0.5)'
                      }}
                    >
                      <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section 
          className="px-4 py-24 relative"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.12 0.02 280), oklch(0.18 0.05 285))'
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start with our free tier and upgrade when you're ready. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center text-lg px-8 py-6 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
                  style={{ 
                    background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                    boxShadow: '0 0 20px oklch(0.45 0.15 290 / 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290 / 0.9), oklch(0.50 0.18 260 / 0.9))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                  }}
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                  Start Building Now
                </Link>
                
                <a
                  href="https://demo.edifyengine.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-lg px-8 py-6 border-2 text-white rounded-md font-semibold transition-all duration-300 transform hover:scale-105 group"
                  style={{ 
                    borderColor: 'oklch(0.85 0.18 130 / 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'oklch(0.85 0.18 130 / 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Launch Demo World
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </div>
  );
};

export default Pricing;
