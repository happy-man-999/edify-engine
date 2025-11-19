import React from 'react';

export const customizationOptions = [
  {
    id: 'start',
    title: 'Start',
    subtitle: 'Start Your First World',
    description: 'Perfect for creators, small projects.',
    icon: 'fa-palette',
    color: '#42677D',
    details: [
      'Unlimited access to our world engine',
      '1 world',
      'Dedicated Server and Hosting',
      'No coding necessary - drag and drop interface'
    ],
    priceMonthly: 29,
    priceAnnual: 252,
    worlds: 1,
    audience: 'Creators, small projects'
  },
  {
    id: 'growth',
    title: 'Growth',
    subtitle: 'Expand Your Universe',
    description: 'Ideal for creators doing multiple projects, small teams.',
    icon: 'fa-cogs',
    color: '#5E8EA9',
    details: [
      'Unlimited access to our world engine',
      'Up to 3 worlds',
      'Dedicated Server and Hosting',
      'No coding necessary - drag and drop interface'
    ],
    priceMonthly: 59,
    priceAnnual: 528,
    worlds: 3,
    audience: 'Creators doing multiple projects, small teams'
  },
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'Scale Your Projects',
    description: 'Perfect for agencies, NFT projects, brands.',
    icon: 'fa-building',
    color: '#8B5CF6',
    details: [
      'Unlimited access to our world engine',
      'Up to 10 worlds',
      'Dedicated Server and Hosting',
      'No coding necessary - drag and drop interface'
    ],
    priceMonthly: 149,
    priceAnnual: 1344,
    worlds: 10,
    audience: 'Agencies, NFT projects, brands'
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    subtitle: 'Unlimited Scale',
    description: 'Custom pricing for large organizations.',
    icon: 'fa-crown',
    color: '#F59E0B',
    details: [
      'Unlimited access to our world engine',
      'Unlimited worlds',
      'Dedicated provisioning',
      'Priority support',
      'Custom solutions'
    ],
    priceMonthly: null,
    priceAnnual: null,
    priceCustom: 'Custom',
    worlds: 'Unlimited',
    audience: 'Large organizations',
    isCustom: true
  },
  {
    id: 'not-ready',
    title: 'Not Ready to Sign Up?',
    subtitle: 'Experience Edify First',
    description: 'Jump into an interactive tour to see what you can build.',
    icon: 'fa-play-circle',
    color: '#374151',
    isExternal: true,
    link: 'https://try.edifyengine.com',
    details: []
  }
];

const CustomizationStep = ({ formData, errors, onInputChange, onNext, billingPeriod = 'annual', onBillingPeriodChange }) => {
  const handleBillingPeriodChange = (period) => {
    if (onBillingPeriodChange) {
      onBillingPeriodChange(period);
    }
  };

  const openExternalLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = (option) => {
    if (option.isExternal && option.link) {
      openExternalLink(option.link);
      return;
    }

    onInputChange('customizationLevel', `${option.id}-plan`);
  };

  const getPrice = (option) => {
    if (option.isCustom) return option.priceCustom;
    if (billingPeriod === 'annual') {
      return option.priceAnnual;
    }
    return option.priceMonthly;
  };

  const getPriceDisplay = (option) => {
    if (option.isCustom) return 'Custom';
    const price = getPrice(option);
    return billingPeriod === 'annual' ? `$${price}/year` : `$${price}/month`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select the plan that best fits your needs</h3>
      </div>

      {/* Billing Period Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          <button
            onClick={() => handleBillingPeriodChange('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white text-[#42677D] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleBillingPeriodChange('annual')}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {customizationOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => !option.disabled && !option.isExternal && handleCardClick(option)}
            className={`bg-white p-6 rounded-xl border-2 transition-all duration-200 ${
              option.disabled
                ? 'cursor-not-allowed opacity-50'
                : option.isExternal
                ? 'cursor-pointer hover:shadow-md'
                : 'cursor-pointer hover:shadow-md'
            } ${
              formData.customizationLevel === `${option.id}-plan` && !option.disabled
                ? 'border-[#42677D] shadow-lg ring-2 ring-[#42677D] ring-opacity-20'
                : 'border-gray-200 hover:border-[#42677D]'
            } ${option.isExternal ? 'border-dashed' : ''}`}
            aria-disabled={option.disabled}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${option.color}1A` }}
              >
                <i className={`fas ${option.icon} text-2xl`} style={{ color: option.color }}></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-lg mb-1">{option.title}</h4>
              <p className="text-sm text-gray-500 mb-2">{option.subtitle}</p>
              {!option.isExternal && (
                <>
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {getPriceDisplay(option)}
                    </div>
                    {billingPeriod === 'annual' && !option.isCustom && (
                      <div className="text-xs text-gray-500">
                        ${(option.priceAnnual / 12).toFixed(0)}/month billed annually
                      </div>
                    )}
                  </div>
                  {option.worlds && (
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {typeof option.worlds === 'number' ? `Up to ${option.worlds} world${option.worlds > 1 ? 's' : ''}` : option.worlds}
                    </div>
                  )}
                  {option.audience && (
                    <p className="text-xs text-gray-500 mb-3">{option.audience}</p>
                  )}
                </>
              )}
              {option.isExternal && (
                <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              )}
              {option.disabled && (
                <div className="mt-4 text-xs text-gray-400">Coming soon</div>
              )}
              {formData.customizationLevel === `${option.id}-plan` && !option.disabled && !option.isExternal && (
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
      
      {errors.customizationLevel && (
        <div className="text-center mb-6">
          <p className="text-red-500 text-sm">{errors.customizationLevel}</p>
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={onNext}
          className="bg-[#42677D] hover:bg-[#355263] text-white px-8 py-3 rounded-lg transition-colors font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CustomizationStep; 