import React from 'react';

const accessOptions = [
  {
    id: 'connect-domain',
    title: 'Connect Domain',
    description: 'Use your own custom domain Coming soon...',
    icon: 'fa-link',
    color: '#42677D'
  },
  {
    id: 'free-domain',
    title: 'Use Free Domain',
    description: 'Get a free subdomain provided by us',
    icon: 'fa-gift',
    color: '#5E8EA9'
  },
  {
    id: 'decide-later',
    title: "I'll decide later",
    description: 'Choose domain access later Coming soon...',
    icon: 'fa-clock',
    color: '#9CA3AF'
  }
];

const AccessStep = ({ formData, errors, onInputChange, onNext }) => {
  const handleCardClick = (option) => {
    onInputChange('accessMethod', option);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your world</h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">How will others access your world?</h3>
        <p className="text-gray-600 mb-6">(If you don't have your own domain, one will be provided for free)</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {accessOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleCardClick(option.title)}
            className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              formData.accessMethod === option.title
                ? 'border-[#42677D] shadow-md'
                : 'border-gray-200 hover:border-[#42677D]'
            }`}
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${option.color}1A` }}
              >
                <i className={`fas ${option.icon} text-2xl`} style={{ color: option.color }}></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-lg mb-2">{option.title}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>
              {formData.accessMethod === option.title && (
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
      
      {errors.accessMethod && (
        <div className="text-center mb-6">
          <p className="text-red-500 text-sm">{errors.accessMethod}</p>
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

export default AccessStep; 