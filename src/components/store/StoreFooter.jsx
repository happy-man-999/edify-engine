import React from "react";

const StoreFooter = () => {
  const openCalendlyModal = () => {
    // Open Calendly in a new tab
    window.open(import.meta.env.VITE_CALENDLY_URL, '_blank', 'noopener,noreferrer');
  };

  return (
  <footer className="glass border-t border-gray-200 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Edify Engine</h3>
          <p className="text-gray-600 text-sm">The premier platform for creating and experiencing immersive virtual worlds.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Documentation</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Tutorials</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">API Reference</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Community</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">About</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Careers</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Blog</a></li>
            <li><button onClick={openCalendlyModal} className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm text-left">Contact</button></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Terms of Service</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Cookie Policy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300 text-sm">Licenses</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Edify Engine. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-[#5E8EA9] transition-colors duration-300"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-gray-500 hover:text-[#5E8EA9] transition-colors duration-300"><i className="fab fa-discord"></i></a>
          <a href="#" className="text-gray-500 hover:text-[#5E8EA9] transition-colors duration-300"><i className="fab fa-github"></i></a>
          <a href="#" className="text-gray-500 hover:text-[#5E8EA9] transition-colors duration-300"><i className="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default StoreFooter;
