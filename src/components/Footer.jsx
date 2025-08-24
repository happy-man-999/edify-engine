import React from "react";
import { homepageTabs } from "./navbar/tabs";

const Footer = () => (
  <footer className="glass border-t border-gray-200 py-6">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <video autoPlay loop muted playsInline className="logo-video mr-2" width={32} height={32}>
            <source src="https://labor-group.com/wp-content/uploads/2025/04/EE_Logo_Color_512x512_02-1.mp4" type="video/mp4" />
          </video>
          <span className="font-semibold text-gray-900">Edify Engine</span>
        </div>
        <div className="flex space-x-6">
          {homepageTabs.filter(tab => tab.title !== "Sign In").map((tab) => (
            <a 
              key={tab.title} 
              href={tab.href} 
              className="text-gray-600 hover:text-[#5E8EA9] transition-colors duration-300"
            >
              {tab.title}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center md:text-left text-sm text-gray-500">
        Instantly Deploy Immersive Spaces. <p></p>© 2025 Edify Engine. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
