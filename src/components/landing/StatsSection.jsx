import React from 'react';

const StatsSection = () => {
  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "1M+", label: "Experiences Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        {/* Triangle */}
        <div className="absolute top-10 left-10 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-blue-500/10" style={{animation: 'pulse 14s ease-in-out infinite'}}></div>
        {/* Square */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-green-500/10 to-teal-500/10" style={{animation: 'bounce 17s ease-in-out infinite'}}></div>
        {/* Diamond */}
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 transform rotate-45" style={{animation: 'spin 30s linear infinite'}}></div>
        {/* Star */}
        <div className="absolute bottom-10 right-1/3 w-12 h-12 text-pink-500/10" style={{animation: 'ping 20s ease-in-out infinite'}}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        {/* Hexagon */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-blue-500/10" style={{animation: 'pulse 15s ease-in-out infinite', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        {/* Cross */}
        <div className="absolute top-1/4 right-1/4 w-14 h-14 bg-gradient-to-r from-purple-500/10 to-pink-500/10" style={{animation: 'bounce 18s ease-in-out infinite', clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)'}}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <div className="text-4xl md:text-5xl font-bold text-[#42677D] mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 