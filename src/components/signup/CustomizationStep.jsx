import React from 'react';

export const customizationOptions = [
  {
    id: 'basic',
    title: 'Basic',
    subtitle: 'Start Your First World',
    description: 'Perfect for creators getting started.',
    icon: 'fa-palette',
    color: '#42677D',
    details: [
      'Unlimited access to our world engine',
      'Dedicated Server and Hosting for 1 world',
      'One-time payment of $9.99 per world deployment on a provided domain',
      'No coding necessary - drag and drop interface'
    ],
    price: 24
  },
  {
    id: 'premium',
    title: 'Premium',
    subtitle: 'Expand Your Universe',
    description: 'Ideal for builders who want more room to experiment and grow.',
    icon: 'fa-cogs',
    color: '#5E8EA9',
    details: [
      'Unlimited access to our world engine',
      'Dedicated Server and Hosting for up to 3 worlds',
      'One-time payment of $9.99 per world deployment on a provided domain',
      'No coding necessary - drag and drop interface'
    ],
    price: 48
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

const CustomizationStep = ({ formData, errors, onInputChange, onNext }) => {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your world</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Which best describes the level of customization?</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {customizationOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => !option.disabled && handleCardClick(option)}
            className={`bg-white p-6 rounded-xl border-2 transition-all duration-200 ${
              option.disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:shadow-md'
            } ${
              formData.customizationLevel === `${option.id}-plan` && !option.disabled
                ? 'border-[#42677D] shadow-md'
                : 'border-gray-200 hover:border-[#42677D]'
            }`}
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
              <p className="text-sm text-gray-500 mb-3">{option.subtitle}</p>
              <p className="text-sm text-gray-600">{option.description}</p>
              {option.disabled && (
                <div className="mt-4 text-xs text-gray-400">Coming soon</div>
              )}
              {formData.customizationLevel === `${option.id}-plan` && !option.disabled && (
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