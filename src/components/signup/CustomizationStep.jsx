import React from 'react';

export const customizationOptions = [
  {
    id: 'start',
    title: 'Start',
    subtitle: 'Start Your First World',
    description: 'Perfect for creators, small projects.',
    icon: 'fa-palette',
    color: 'oklch(0.45 0.15 290)',
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
    color: 'oklch(0.50 0.18 260)',
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
    color: 'oklch(0.55 0.18 260)',
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
    color: 'oklch(0.60 0.15 320)',
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
    color: 'oklch(0.65 0.05 280)',
    isExternal: true,
    link: 'https://demo.edifyengine.com',
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
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Choose Your Plan</h2>
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>Select the plan that best fits your needs</h3>
      </div>

      {/* Billing Period Toggle */}
      <div className="flex justify-center mb-8">
        <div className="rounded-lg p-1 inline-flex" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
          <button
            onClick={() => handleBillingPeriodChange('monthly')}
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
            onClick={() => handleBillingPeriodChange('annual')}
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
      
      <div className="space-y-6 mb-8">
        {/* First Row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customizationOptions.slice(0, 3).map((option) => (
            <div
              key={option.id}
              onClick={() => !option.disabled && !option.isExternal && handleCardClick(option)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 h-full flex flex-col ${
                option.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : option.isExternal
                  ? 'cursor-pointer hover:shadow-md'
                  : 'cursor-pointer hover:shadow-md'
              } ${option.isExternal ? 'border-dashed' : ''}`}
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: formData.customizationLevel === `${option.id}-plan` && !option.disabled
                  ? 'oklch(0.45 0.15 290)'
                  : 'oklch(0.25 0.05 285)',
                boxShadow: formData.customizationLevel === `${option.id}-plan` && !option.disabled
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 2px oklch(0.45 0.15 290 / 0.2)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (!option.disabled && formData.customizationLevel !== `${option.id}-plan`) {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.customizationLevel !== `${option.id}-plan`) {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                }
              }}
              aria-disabled={option.disabled}
            >
              <div className="text-center flex-1 flex flex-col">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${option.color} / 0.2` }}
                >
                  <i className={`fas ${option.icon} text-2xl`} style={{ color: option.color }}></i>
                </div>
                <h4 className="font-semibold text-lg mb-1" style={{ color: 'oklch(0.98 0.01 280)' }}>{option.title}</h4>
                <p className="text-sm mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>{option.subtitle}</p>
                {!option.isExternal && (
                  <>
                    <div className="mb-3">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {getPriceDisplay(option)}
                      </div>
                      {billingPeriod === 'annual' && !option.isCustom && (
                        <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>
                          ${(option.priceAnnual / 12).toFixed(0)}/month billed annually
                        </div>
                      )}
                    </div>
                    {option.worlds && (
                      <div className="text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {typeof option.worlds === 'number' ? `Up to ${option.worlds} world${option.worlds > 1 ? 's' : ''}` : option.worlds}
                      </div>
                    )}
                    {option.audience && (
                      <p className="text-xs mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>{option.audience}</p>
                    )}
                  </>
                )}
                {option.isExternal && (
                  <p className="text-sm mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>{option.description}</p>
                )}
                {option.disabled && (
                  <div className="mt-4 text-xs" style={{ color: 'oklch(0.50 0.05 280)' }}>Coming soon</div>
                )}
                {formData.customizationLevel === `${option.id}-plan` && !option.disabled && !option.isExternal && (
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
        
        {/* Second Row: 2 cards centered */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {customizationOptions.slice(3).map((option) => (
            <div
              key={option.id}
              onClick={() => !option.disabled && handleCardClick(option)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 h-full flex flex-col w-full md:w-[calc(33.333%-1rem)] ${
                option.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : option.isExternal
                  ? 'cursor-pointer hover:shadow-md'
                  : 'cursor-pointer hover:shadow-md'
              } ${option.isExternal ? 'border-dashed' : ''}`}
              style={{
                backgroundColor: 'oklch(0.18 0.05 285)',
                borderColor: formData.customizationLevel === `${option.id}-plan` && !option.disabled
                  ? 'oklch(0.45 0.15 290)'
                  : 'oklch(0.25 0.05 285)',
                boxShadow: formData.customizationLevel === `${option.id}-plan` && !option.disabled
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 2px oklch(0.45 0.15 290 / 0.2)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (!option.disabled && formData.customizationLevel !== `${option.id}-plan`) {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.customizationLevel !== `${option.id}-plan`) {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                }
              }}
              aria-disabled={option.disabled}
            >
              <div className="text-center flex-1 flex flex-col">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${option.color} / 0.2` }}
                >
                  <i className={`fas ${option.icon} text-2xl`} style={{ color: option.color }}></i>
                </div>
                <h4 className="font-semibold text-lg mb-1" style={{ color: 'oklch(0.98 0.01 280)' }}>{option.title}</h4>
                <p className="text-sm mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>{option.subtitle}</p>
                {!option.isExternal && (
                  <>
                    <div className="mb-3">
                      <div className="text-2xl font-bold mb-1" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {getPriceDisplay(option)}
                      </div>
                      {billingPeriod === 'annual' && !option.isCustom && (
                        <div className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>
                          ${(option.priceAnnual / 12).toFixed(0)}/month billed annually
                        </div>
                      )}
                    </div>
                    {option.worlds && (
                      <div className="text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                        {typeof option.worlds === 'number' ? `Up to ${option.worlds} world${option.worlds > 1 ? 's' : ''}` : option.worlds}
                      </div>
                    )}
                    {option.audience && (
                      <p className="text-xs mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>{option.audience}</p>
                    )}
                  </>
                )}
                {option.isExternal && (
                  <>
                    <p className="text-sm mb-3" style={{ color: 'oklch(0.65 0.05 280)' }}>{option.description}</p>
                    <div className="flex-1"></div>
                  </>
                )}
                {option.disabled && (
                  <div className="mt-4 text-xs" style={{ color: 'oklch(0.50 0.05 280)' }}>Coming soon</div>
                )}
                {formData.customizationLevel === `${option.id}-plan` && !option.disabled && !option.isExternal && (
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
      </div>
      
      {errors.customizationLevel && (
        <div className="text-center mb-6">
          <p className="text-sm" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.customizationLevel}</p>
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-lg transition-colors font-medium"
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
          Continue
        </button>
      </div>
    </div>
  );
};

export default CustomizationStep; 