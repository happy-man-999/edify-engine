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
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Triangle */}
        <div className="absolute top-20 left-10 w-0 h-0 border-l-[32px] border-r-[32px] border-b-[56px] border-l-transparent border-r-transparent border-b-blue-400/20" style={{animation: 'pulse 12s ease-in-out infinite'}}></div>
        {/* Square */}
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-green-400/20 to-teal-400/20" style={{animation: 'bounce 15s ease-in-out infinite'}}></div>
        {/* Circle */}
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full" style={{animation: 'spin 25s linear infinite'}}></div>
        {/* Diamond */}
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-red-400/20 transform rotate-45" style={{animation: 'ping 18s ease-in-out infinite'}}></div>
        {/* Star */}
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 text-indigo-400/20" style={{animation: 'pulse 13s ease-in-out infinite'}}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        {/* Hexagon */}
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20" style={{animation: 'bounce 16s ease-in-out infinite', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        {/* Cross */}
        <div className="absolute top-1/4 right-1/3 w-8 h-8 bg-gradient-to-r from-purple-400/20 to-pink-400/20" style={{animation: 'pulse 14s ease-in-out infinite', clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)'}}></div>
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
              Start Building Now
            </Link>
            <Link 
              to="/store" 
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-white/30 hover:border-white/50"
            >
              <i className="fas fa-store mr-2"></i>
              Browse Store
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