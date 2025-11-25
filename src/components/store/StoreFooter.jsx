import React from "react";
import { Link } from "react-router-dom";

const StoreFooter = () => {

  return (
  <footer className="glass border-t py-8 mt-auto" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Edify Engine</h3>
          <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>The premier platform for creating and experiencing immersive virtual worlds.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Documentation</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Tutorials</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>API Reference</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Community</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>About</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Careers</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Blog</a></li>
            <li><Link to="/contact" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Terms of Service</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Privacy Policy</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Cookie Policy</a></li>
            <li><a href="#" className="transition-colors duration-300 text-sm" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}>Licenses</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderColor: 'oklch(0.25 0.05 285)' }}>
        <p className="text-sm mb-4 md:mb-0" style={{ color: 'oklch(0.65 0.05 280)' }}>© 2025 Edify Engine. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="transition-colors duration-300" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}><i className="fab fa-twitter"></i></a>
          <a href="#" className="transition-colors duration-300" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}><i className="fab fa-discord"></i></a>
          <a href="#" className="transition-colors duration-300" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}><i className="fab fa-github"></i></a>
          <a href="#" className="transition-colors duration-300" style={{ color: 'oklch(0.65 0.05 280)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'} onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.65 0.05 280)'}><i className="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default StoreFooter;
