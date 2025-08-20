import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingPageHeroImage from '../../assets/landing-hero.png';

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
          src={LandingPageHeroImage}
          alt="Edify Engine Landing Page" 
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-[46rem] mx-auto px-6 -mt-45">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-7xl font-semibold mb-6 leading-tight">
            <span className="text-white font-bold" style={{ 
              textShadow: `
                -2px -2px 0 #648DA6,
                2px -2px 0 #648DA6,
                -2px 2px 0 #648DA6,
                2px 2px 0 #648DA6,
                -1px -1px 0 #648DA6,
                1px -1px 0 #648DA6,
                -1px 1px 0 #648DA6,
                1px 1px 0 #648DA6
              `
            }}>
              Build Your
            </span>
            <span className="block bg-[#4B748B] bg-clip-text text-transparent font-extrabold">
              Virtual Universe
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-[#4B748B] leading-relaxed font-['Calibri'] font-light">
            Create immersive 3D experiences, virtual worlds, and interactive environments 
            without writing a single line of code. Launch in minutes, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] hover:from-[#355263] hover:to-[#4a7a8f] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <i className="fas fa-rocket mr-2"></i>
              Start Building Now
            </Link>
            <Link 
              to="/store" 
              className="bg-gradient-to-r from-[#65707C] to-[#767E88] backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:from-[#65707C]/80 hover:to-[#767E88]/80 hover:shadow-lg hover:shadow-[#65707C]/25 active:from-[#65707C]/60 active:to-[#767E88]/60 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#65707C] focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <i className="fas fa-store mr-2"></i>
              Browse Store
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-[6rem] left-1/2 transform -translate-x-1/4 animate-bounce">
        <svg 
          className="w-12 h-12" 
          fill="white" 
          stroke="#4B748B" 
          strokeWidth="1"
          viewBox="0 0 24 24"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 