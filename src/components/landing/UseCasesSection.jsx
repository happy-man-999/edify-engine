import React from 'react';
import ExploreSection from '../ExploreSection';

const UseCasesSection = () => {
  return (
    <section className="py-20" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Explore Our
            <span className="block">Virtual Worlds</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the incredible variety of immersive experiences already built with Edify Engine. 
            From gaming and entertainment to business and education - see what's possible.
          </p>
        </div>
        
        {/* Use the same ExploreSection component from homepage */}
        <ExploreSection showHeader={false} />
      </div>
    </section>
  );
};

export default UseCasesSection;
