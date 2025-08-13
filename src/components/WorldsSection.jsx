import React from "react";

const WorldsSection = () => (
  <section className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Worlds</h2>
      <button className="text-[#5E8EA9] hover:text-[#42677D] flex items-center transition-colors duration-300">
        <span>View All</span>
        <i className="fas fa-chevron-right ml-2"></i>
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Empty State with Glowing Border */}
      <div onClick={() => window.location.href='https://form.typeform.com/to/KmQr2jrU'} className="professional-card border-2 border-dashed border-gray-300 hover:border-[#42677D] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#42677D]/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="w-16 h-16 bg-[#42677D]/10 rounded-full flex items-center justify-center mb-4 relative z-10">
          <i className="fas fa-plus text-[#42677D]"></i>
        </div>
        <h3 className="font-semibold mb-1 relative z-10 text-gray-900">Create New World</h3>
        <p className="text-gray-500 text-sm text-center relative z-10">Start building your next virtual experience</p>
      </div>
    </div>
  </section>
);

export default WorldsSection;
