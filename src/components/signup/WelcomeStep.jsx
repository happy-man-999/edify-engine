import React from 'react';

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="hero-section mb-8 p-12 relative rounded-3xl overflow-hidden">
        <div className="sky-background absolute inset-0"></div>
        <div className="clouds absolute inset-0"></div>
        <div className="hero-content relative z-10">
          <h1 className="text-5xl font-bold mb-6" style={{ color: 'oklch(0.98 0.01 280)' }}>
            Instantly deploy <span 
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              immersive spaces
            </span>
          </h1>
          <p className="text-xl mb-8" style={{ color: 'oklch(0.65 0.05 280)' }}>
            No coding required
          </p>
          <button
            onClick={onNext}
            className="px-8 py-4 rounded-lg transition shadow-sm font-medium text-lg"
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
            <i className="fas fa-rocket mr-2"></i>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep; 