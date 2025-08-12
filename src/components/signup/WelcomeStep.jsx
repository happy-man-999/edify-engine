import React from 'react';

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="hero-section mb-8 p-12 relative rounded-3xl overflow-hidden">
        <div className="sky-background absolute inset-0"></div>
        <div className="clouds absolute inset-0"></div>
        <div className="hero-content relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            Instantly deploy <span className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] bg-clip-text text-transparent">immersive spaces</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            No coding required
          </p>
          <button
            onClick={onNext}
            className="bg-[#42677D] hover:bg-[#355263] text-white px-8 py-4 rounded-lg transition shadow-sm font-medium text-lg"
          >
            <i className="fas fa-rocket mr-2"></i>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep; 