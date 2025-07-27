import React from "react";

const StoreFooter = () => (
  <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-4">Edify Engine</h3>
          <p className="text-gray-600 text-sm">The premier platform for creating and experiencing immersive virtual worlds.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Documentation</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Tutorials</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">API Reference</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Community</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">About</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Careers</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Blog</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Terms of Service</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Cookie Policy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#42677D] transition text-sm">Licenses</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 Edify Engine. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-[#42677D] transition"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-gray-500 hover:text-[#42677D] transition"><i className="fab fa-discord"></i></a>
          <a href="#" className="text-gray-500 hover:text-[#42677D] transition"><i className="fab fa-github"></i></a>
          <a href="#" className="text-gray-500 hover:text-[#42677D] transition"><i className="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
  </footer>
);

export default StoreFooter;
