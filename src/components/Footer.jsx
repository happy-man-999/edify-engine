import React from "react";
import { Link } from "react-router-dom";
import { tabs as allTabs, premiumTabs } from "./navbar/tabs";
import { useAuth } from "../hooks/useAuth";

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  
  
  let tabs = allTabs;
  
  // Filter out "Sign In" and "Try" tabs if user is authenticated
  if (isAuthenticated) {
    tabs = tabs.filter(tab => tab.title !== "Sign In" && tab.title !== "Demo");
    
    // Add role-based tabs
    if (user?.isContributor) {
      tabs.push({ title: "Contribute", href: "/contribute" });
    }
    
    if (user?.role === 'admin') {
      tabs.push({ title: "Admin Dashboard", href: "/admin" });
    }
    
    // Add premium tabs for premium plan users
    if (user?.plan === 'premium') {
      tabs.push(...premiumTabs);
    }
  }

  return (
    <footer className="glass border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <video autoPlay loop muted playsInline className="logo-video mr-2" width={32} height={32}>
                <source src="https://labor-group.com/wp-content/uploads/2025/04/EE_Logo_Color_512x512_02-1.mp4" type="video/mp4" />
              </video>
              <span className="text-xl font-bold text-gray-900">Edify Engine</span>
            </div>
            <p className="text-gray-600">
              Building the future of virtual experiences, one world at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Platform</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/home" className="hover:text-[#5E8EA9] transition-colors">Home</a></li>
              <li><a href="/store" className="hover:text-[#5E8EA9] transition-colors">Store</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/contribute" className="hover:text-[#5E8EA9] transition-colors">Contribute</a></li>
              <li><Link to="/contact" className="hover:text-[#5E8EA9] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/edifyengine" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#5E8EA9] transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://tiktok.com/@edifyengine" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#5E8EA9] transition-colors">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a href="https://x.com/edifyengine" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#5E8EA9] transition-colors">
                <i className="fab fa-x-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; 2025 Edify Engine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
