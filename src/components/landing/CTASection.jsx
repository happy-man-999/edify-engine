import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#42677D] via-[#5E8EA9] to-[#42677D] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        {/* Triangle */}
        <div className="absolute top-20 left-10 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-white/10" style={{animation: 'pulse 16s ease-in-out infinite'}}></div>
        {/* Square */}
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10" style={{animation: 'bounce 19s ease-in-out infinite'}}></div>
        {/* Diamond */}
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-white/10 transform rotate-45" style={{animation: 'spin 35s linear infinite'}}></div>
        {/* Star */}
        <div className="absolute bottom-20 right-1/3 w-28 h-28 text-white/10" style={{animation: 'ping 22s ease-in-out infinite'}}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        {/* Hexagon */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10" style={{animation: 'pulse 17s ease-in-out infinite', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        {/* Cross */}
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/10" style={{animation: 'bounce 20s ease-in-out infinite', clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)'}}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Build Something
          <span className="block bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
            Extraordinary?
          </span>
        </h2>
        <p className="text-xl text-gray-100 mb-8 leading-relaxed">
          Join the future of virtual experiences. Start building your immersive world today 
          and see your vision come to life in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-[#42677D] hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <i className="fas fa-rocket mr-2"></i>
            Start Building Now
          </Link>
          <Link 
            to="/store" 
            className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
          >
            <i className="fas fa-store mr-2"></i>
            Browse Templates
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 