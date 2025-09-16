import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Edify Engine</h3>
            <p className="text-gray-400">
              Building the future of virtual experiences, one world at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/store" className="hover:text-white transition-colors">Store</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/contribute" className="hover:text-white transition-colors">Contribute</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/edifyengine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://tiktok.com/@edifyengine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a href="https://x.com/edifyengine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-x-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Edify Engine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter; 