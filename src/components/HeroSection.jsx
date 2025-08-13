import React from "react";

const HeroSection = () => (
  <section className="hero-section mb-12 p-12 relative rounded-3xl overflow-hidden glass border border-gray-200">
    <div className="sky-background absolute inset-0 opacity-20"></div>
    <div className="clouds absolute inset-0 opacity-10"></div>
    <div className="hero-content max-w-4xl mx-auto text-center relative z-10">
      <h1 className="text-5xl font-bold mb-6 text-gray-900">
        Build Your <span className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] bg-clip-text text-transparent">Virtual World</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Create immersive 3D experiences with our powerful tools. No coding required - just your imagination and creativity.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={() => window.location.href='https://form.typeform.com/to/KmQr2jrU'} className="btn-primary">
          <i className="fas fa-play mr-2"></i> Start Building
        </button>
        <button onClick={() => window.location.href='https://try.edifyengine.com'} className="btn-secondary">
          <i className="fas fa-bolt mr-2"></i> Try Now
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;
