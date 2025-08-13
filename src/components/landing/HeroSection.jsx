import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=1080&fit=crop" 
          alt="Virtual World Landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your
            <span className="block bg-gradient-to-r from-[#42677D] via-[#5E8EA9] to-[#42677D] bg-clip-text text-transparent">
              Virtual Universe
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Create immersive 3D experiences, virtual worlds, and interactive environments 
            without writing a single line of code. Launch in minutes, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] hover:from-[#355263] hover:to-[#4a7a8f] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <i className="fas fa-rocket mr-2"></i>
              Start Building Free
            </Link>
            <Link 
              to="/store" 
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-white/30 hover:border-white/50"
            >
              <i className="fas fa-store mr-2"></i>
              Explore Store
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i className="fas fa-chevron-down text-white text-2xl"></i>
      </div>
    </section>
  );
};

export default HeroSection; 