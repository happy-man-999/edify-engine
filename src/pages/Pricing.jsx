import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalStyles from '../components/GlobalStyles';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('annual');

  const plans = [
    {
      id: 'start',
      title: 'Start',
      subtitle: 'Start Your First World',
      description: 'Perfect for creators, small projects.',
      icon: 'fa-palette',
      color: '#42677D',
      priceMonthly: 29,
      priceAnnual: 252,
      worlds: 1,
      audience: 'Creators, small projects',
      features: [
        'Unlimited access to our world engine',
        '1 world',
        'Dedicated Server and Hosting',
        'No coding necessary - drag and drop interface'
      ]
    },
    {
      id: 'growth',
      title: 'Growth',
      subtitle: 'Expand Your Universe',
      description: 'Ideal for creators doing multiple projects, small teams.',
      icon: 'fa-cogs',
      color: '#5E8EA9',
      priceMonthly: 59,
      priceAnnual: 528,
      worlds: 3,
      audience: 'Creators doing multiple projects, small teams',
      features: [
        'Unlimited access to our world engine',
        'Up to 3 worlds',
        'Dedicated Server and Hosting',
        'No coding necessary - drag and drop interface'
      ]
    },
    {
      id: 'studio',
      title: 'Studio',
      subtitle: 'Scale Your Projects',
      description: 'Perfect for agencies, NFT projects, brands.',
      icon: 'fa-building',
      color: '#8B5CF6',
      priceMonthly: 149,
      priceAnnual: 1344,
      worlds: 10,
      audience: 'Agencies, NFT projects, brands',
      features: [
        'Unlimited access to our world engine',
        'Up to 10 worlds',
        'Dedicated Server and Hosting',
        'No coding necessary - drag and drop interface'
      ]
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      subtitle: 'Unlimited Scale',
      description: 'Custom pricing for large organizations.',
      icon: 'fa-crown',
      color: '#F59E0B',
      priceMonthly: null,
      priceAnnual: null,
      priceCustom: 'Custom',
      worlds: 'Unlimited',
      audience: 'Large organizations',
      isCustom: true,
      features: [
        'Unlimited access to our world engine',
        'Unlimited worlds',
        'Dedicated provisioning',
        'Priority support',
        'Custom solutions'
      ],
      priceRange: 'Starts $500-$2500/month depending on usage and support'
    }
  ];

  const getPrice = (plan) => {
    if (plan.isCustom) return plan.priceCustom;
    return billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  };

  const getPriceDisplay = (plan) => {
    if (plan.isCustom) return 'Custom';
    const price = getPrice(plan);
    return billingPeriod === 'annual' ? `$${price}/year` : `$${price}/month`;
  };

  const handleGetStarted = (planId) => {
    if (planId === 'enterprise') {
      navigate('/contact');
    } else {
      navigate('/signup', { state: { selectedPlan: `${planId}-plan` } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalStyles />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#42677D] to-[#5E8EA9] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our powerful world engine and dedicated hosting.
          </p>
          
          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 rounded-lg p-1 inline-flex backdrop-blur-sm">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-[#42677D] shadow-sm'
                    : 'text-white hover:text-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-white text-[#42677D] shadow-sm'
                    : 'text-white hover:text-gray-100'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.id === 'growth' ? 'border-[#5E8EA9] scale-105 md:-mt-4' : 'border-gray-200'
              }`}
            >
              {plan.id === 'growth' && (
                <div className="bg-[#5E8EA9] text-white text-center py-2 rounded-t-2xl">
                  <span className="text-sm font-semibold">Most Popular</span>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${plan.color}1A` }}
                  >
                    <i className={`fas ${plan.icon} text-2xl`} style={{ color: plan.color }}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.subtitle}</p>
                  
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {getPriceDisplay(plan)}
                    </div>
                    {!plan.isCustom && (
                      <div className="text-sm text-gray-500">
                        {billingPeriod === 'annual' 
                          ? `$${(plan.priceAnnual / 12).toFixed(0)}/month billed annually`
                          : 'Billed monthly'
                        }
                      </div>
                    )}
                    {plan.isCustom && plan.priceRange && (
                      <div className="text-sm text-gray-500 mt-2">
                        {plan.priceRange}
                      </div>
                    )}
                  </div>

                  {plan.worlds && (
                    <div className="text-lg font-semibold text-gray-700 mb-2">
                      {typeof plan.worlds === 'number' 
                        ? `Up to ${plan.worlds} world${plan.worlds > 1 ? 's' : ''}` 
                        : plan.worlds}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mb-6">{plan.audience}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-check text-green-500 mr-3 mt-1 flex-shrink-0"></i>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleGetStarted(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.id === 'growth'
                      ? 'bg-[#5E8EA9] text-white hover:bg-[#4a7a95]'
                      : plan.isCustom
                      ? 'bg-[#F59E0B] text-white hover:bg-[#d97706]'
                      : 'bg-[#42677D] text-white hover:bg-[#355263]'
                  }`}
                >
                  {plan.isCustom ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards through Stripe. All payments are secure and encrypted.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                We offer a free trial experience. Visit our <a href="https://try.edifyengine.com" target="_blank" rel="noopener noreferrer" className="text-[#42677D] hover:underline">try page</a> to explore our platform before signing up.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What happens if I exceed my world limit?
              </h3>
              <p className="text-gray-600">
                If you need more worlds, you can upgrade to a higher plan at any time. Enterprise plans offer unlimited worlds.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for annual plans. Monthly plans can be cancelled at any time with no long-term commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Join thousands of creators building amazing worlds with Edify Engine.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-[#42677D] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;

