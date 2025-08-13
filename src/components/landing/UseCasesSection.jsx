import React from 'react';

const UseCasesSection = () => {
  const useCases = [
    {
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
      title: "Virtual Events",
      description: "Host conferences, trade shows, and networking events in immersive 3D spaces",
      stats: "500+ events hosted"
    },
    {
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
      title: "Training & Education",
      description: "Create interactive learning environments for corporate training and education",
      stats: "10,000+ learners trained"
    },
    {
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
      title: "Product Showcases",
      description: "Present products in interactive 3D environments for better customer engagement",
      stats: "200+ products showcased"
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      title: "Virtual Real Estate",
      description: "Showcase properties with immersive walkthroughs and interactive features",
      stats: "1,000+ properties listed"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Business with
            <span className="block bg-gradient-to-r from-[#42677D] to-[#5E8EA9] bg-clip-text text-transparent">
              Virtual Experiences
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading companies are using Edify Engine to create engaging, 
            interactive experiences that drive results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {useCases.map((useCase, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm text-[#42677D]">{useCase.stats}</div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
              <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection; 