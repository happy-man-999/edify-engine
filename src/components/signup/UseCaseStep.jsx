import React from 'react';

const useCases = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Showcase your work and projects',
    icon: 'fa-briefcase',
    color: '#42677D'
  },
  {
    id: 'events',
    title: 'Events',
    description: 'Host virtual events and gatherings',
    icon: 'fa-calendar-alt',
    color: '#5E8EA9'
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Build and engage communities',
    icon: 'fa-users',
    color: '#42677D'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    description: 'Sell products and services',
    icon: 'fa-shopping-cart',
    color: '#5E8EA9'
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Custom use case',
    icon: 'fa-lightbulb',
    color: '#42677D'
  },
  {
    id: 'decide-later',
    title: "I'll decide later",
    description: 'Not sure yet',
    icon: 'fa-clock',
    color: '#9CA3AF'
  }
];

const UseCaseStep = ({ formData, errors, onUseCaseToggle, onNext }) => {
  const handleCardClick = (useCase) => {
    onUseCaseToggle(useCase);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your world</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">How do you plan to use your world?</h3>
        <p className="text-gray-600">Choose as many as you like</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {useCases.map((useCase) => (
          <div
            key={useCase.id}
            onClick={() => handleCardClick(useCase.title)}
            className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              formData.useCases.includes(useCase.title)
                ? 'border-[#42677D] shadow-md'
                : 'border-gray-200 hover:border-[#42677D]'
            }`}
          >
            <div className="flex items-center mb-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: `${useCase.color}1A` }}
              >
                <i className={`fas ${useCase.icon}`} style={{ color: useCase.color }}></i>
              </div>
              <h4 className="font-semibold text-gray-900">{useCase.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{useCase.description}</p>
            {formData.useCases.includes(useCase.title) && (
              <div className="mt-3 flex justify-end">
                <div className="w-5 h-5 bg-[#42677D] rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {errors.useCases && (
        <div className="text-center mb-6">
          <p className="text-red-500 text-sm">{errors.useCases}</p>
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

export default UseCaseStep; 