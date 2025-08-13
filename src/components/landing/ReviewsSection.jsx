import React, { useState, useEffect } from 'react';

const ReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    // Auto-rotate reviews
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const reviews = [
    {
      name: "Sarah Chen",
      role: "3D Artist & Developer",
      company: "Digital Dreams Studio",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Edify Engine transformed our workflow. We went from months of development to launching immersive experiences in weeks. The quality and ease of use is unmatched."
    },
    {
      name: "Marcus Rodriguez",
      role: "Creative Director",
      company: "Virtual Ventures",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The platform's intuitive interface and powerful features allowed our team to focus on creativity instead of technical hurdles. Game-changing technology!"
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Lead",
      company: "Tech Innovation Lab",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "We've been using Edify Engine for our virtual research environments. The performance and scalability are exceptional. Highly recommended for enterprise use."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by Creators
            <span className="block bg-gradient-to-r from-[#42677D] to-[#5E8EA9] bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed their ideas into 
            reality with Edify Engine.
          </p>
        </div>
        
        <div className="relative">
          <div className="flex justify-center mb-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full mx-2 transition-all duration-300 ${
                  index === currentReview ? 'bg-[#42677D] scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-[#42677D]/10 to-[#5E8EA9]/10 rounded-3xl p-12 text-center">
            <div className="flex justify-center mb-6">
              {[...Array(reviews[currentReview].rating)].map((_, i) => (
                <i key={i} className="fas fa-star text-yellow-400 text-2xl mx-1"></i>
              ))}
            </div>
            <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
              "{reviews[currentReview].text}"
            </blockquote>
            <div className="flex items-center justify-center">
              <img 
                src={reviews[currentReview].avatar} 
                alt={reviews[currentReview].name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="text-left">
                <div className="font-semibold text-gray-900">{reviews[currentReview].name}</div>
                <div className="text-gray-600">{reviews[currentReview].role}</div>
                <div className="text-[#42677D]">{reviews[currentReview].company}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection; 