import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#42677D] via-[#5E8EA9] to-[#42677D]">
      <div className="max-w-4xl mx-auto px-6 text-center">
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