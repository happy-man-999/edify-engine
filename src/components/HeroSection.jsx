import React from "react";

const HeroSection = () => (
  <section 
    className="hero-section mb-12 p-12 relative rounded-3xl overflow-hidden glass border"
    style={{
      backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
      borderColor: 'oklch(0.25 0.05 285 / 0.5)'
    }}
  >
    <div className="sky-background absolute inset-0 opacity-20"></div>
    <div className="clouds absolute inset-0 opacity-10"></div>
    <div className="hero-content max-w-4xl mx-auto text-center relative z-10">
      <h1 className="text-5xl font-bold mb-6" style={{ color: 'oklch(0.98 0.01 280)' }}>
        Build Your <span 
          className="bg-clip-text text-transparent"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >Virtual World</span>
      </h1>
      <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'oklch(0.65 0.05 280)' }}>
        Create immersive 3D experiences with our powerful tools. No coding required - just your imagination and creativity.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={() => window.location.href='https://form.typeform.com/to/KmQr2jrU'} className="btn-primary">
          <i className="fas fa-play mr-2"></i> Start Building
        </button>
        <button onClick={() => window.location.href='https://demo.edifyengine.com'} className="btn-secondary">
          <i className="fas fa-bolt mr-2"></i> Try Now
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;
